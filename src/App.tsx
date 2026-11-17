import { useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/AppShell';
import { DeviceHub } from './components/DeviceHub';
import { Inspector } from './components/Inspector';
import { Matrix } from './components/Matrix';
import { Runbook } from './components/Runbook';
import { createCustomDevice } from './data/presets';
import { decodeCi, decodePlan, parseHash } from './lib/hashCodec';
import { generateRunbook } from './lib/runbook';
import {
  loadDevices,
  loadRunbookDone,
  loadSelectedId,
  saveDevices,
  saveRunbookDone,
  saveSelectedId,
} from './lib/storage';
import type { DeviceCI, MasterPlan, View } from './types';

function upsertDevice(list: DeviceCI[], incoming: DeviceCI): DeviceCI[] {
  const idx = list.findIndex((d) => d.id === incoming.id);
  if (idx >= 0) {
    const next = [...list];
    next[idx] = {
      ...next[idx],
      ...incoming,
      isCustom: next[idx].isCustom || incoming.isCustom,
    };
    return next;
  }
  return [...list, { ...incoming, isCustom: incoming.isCustom ?? true }];
}

function upsertMany(list: DeviceCI[], incoming: DeviceCI[]): DeviceCI[] {
  return incoming.reduce((acc, d) => upsertDevice(acc, d), list);
}

export default function App() {
  const [view, setView] = useState<View>('hub');
  const [devices, setDevices] = useState<DeviceCI[]>(() => loadDevices());
  const [selectedId, setSelectedId] = useState<string | null>(() => loadSelectedId());
  const [plan, setPlan] = useState<MasterPlan | null>(null);
  const [runbookDone, setRunbookDone] = useState<Record<string, boolean>>(() => loadRunbookDone());
  const [helpOpen, setHelpOpen] = useState(false);
  const [hashNotice, setHashNotice] = useState<string | null>(null);

  const selected = useMemo(
    () => devices.find((d) => d.id === selectedId) ?? null,
    [devices, selectedId],
  );

  // Persist devices
  useEffect(() => {
    saveDevices(devices);
  }, [devices]);

  useEffect(() => {
    saveSelectedId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    saveRunbookDone(runbookDone);
  }, [runbookDone]);

  // GitHub Pages SPA redirect restore
  useEffect(() => {
    const redirect = sessionStorage.getItem('gh-pages-redirect');
    if (redirect) {
      sessionStorage.removeItem('gh-pages-redirect');
      // Path already landed on index; hash may be in stored value
      const hashIdx = redirect.indexOf('#');
      if (hashIdx >= 0) {
        window.location.hash = redirect.slice(hashIdx);
      }
    }
  }, []);

  // Ingest #ci= / #plan= hashes
  useEffect(() => {
    const ingest = () => {
      const parsed = parseHash();
      if (!parsed) return;

      if (parsed.kind === 'ci') {
        const ci = decodeCi(parsed.payload);
        if (!ci) {
          setHashNotice('Could not read that #ci= device link.');
          return;
        }
        setDevices((prev) => upsertDevice(prev, ci));
        setSelectedId(ci.id);
        setView('inspector');
        setHashNotice(`Imported device passport: ${ci.name}`);
        return;
      }

      if (parsed.kind === 'plan') {
        const master = decodePlan(parsed.payload);
        if (!master) {
          setHashNotice('Could not read that #plan= runbook link.');
          return;
        }
        setDevices((prev) => upsertMany(prev, master.devices));
        setPlan(master);
        setView('runbook');
        setHashNotice('Loaded shared master runbook.');
      }
    };

    ingest();
    window.addEventListener('hashchange', ingest);
    return () => window.removeEventListener('hashchange', ingest);
  }, []);

  const selectDevice = (device: DeviceCI) => {
    setSelectedId(device.id);
    setView('inspector');
  };

  const addDevice = () => {
    const custom = createCustomDevice();
    setDevices((prev) => [...prev, custom]);
    setSelectedId(custom.id);
    setView('inspector');
  };

  const updateDevice = (next: DeviceCI) => {
    setDevices((prev) => prev.map((d) => (d.id === next.id ? next : d)));
  };

  const removeSelected = () => {
    if (!selected?.isCustom) {
      setView('hub');
      return;
    }
    setDevices((prev) => prev.filter((d) => d.id !== selected.id));
    setSelectedId(null);
    setView('hub');
  };

  const markChecked = () => {
    if (!selected) return;
    updateDevice({ ...selected, checked: true, updatedAt: new Date().toISOString() });
  };

  const goGenerateRunbook = () => {
    const next = generateRunbook(devices);
    setPlan(next);
    setView('runbook');
    window.location.hash = '';
  };

  const presetIndexLabel = (() => {
    if (!selected || selected.isCustom) return 'Custom device';
    const presets = devices.filter((d) => !d.isCustom);
    const idx = presets.findIndex((d) => d.id === selected.id);
    return idx >= 0 ? `Device ${idx + 1} of ${presets.length}` : 'Device check';
  })();

  return (
    <AppShell
      onHelp={() => setHelpOpen(true)}
      setView={(v) => {
        if (v === 'inspector' && !selectedId && devices[0]) {
          setSelectedId(devices[0].id);
        }
        setView(v);
      }}
      view={view}
    >
      {hashNotice && (
        <div className="border-b border-[#ccd4f0] bg-[#eef1ff] px-5 py-3 text-center text-sm font-semibold text-[#243474]">
          {hashNotice}{' '}
          <button
            className="ml-2 underline"
            onClick={() => setHashNotice(null)}
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}

      {view === 'hub' && (
        <DeviceHub devices={devices} onAdd={addDevice} onSelect={selectDevice} />
      )}

      {view === 'inspector' && selected && (
        <Inspector
          device={selected}
          indexLabel={presetIndexLabel}
          onBack={() => setView('hub')}
          onChange={updateDevice}
          onMarkChecked={markChecked}
          onRemove={removeSelected}
        />
      )}

      {view === 'inspector' && !selected && (
        <div className="mx-auto max-w-lg px-5 py-16 text-center">
          <p className="text-lg font-bold">No device selected</p>
          <button className="primary-button mt-4" onClick={() => setView('hub')} type="button">
            Back to devices
          </button>
        </div>
      )}

      {view === 'matrix' && (
        <Matrix
          devices={devices}
          onGenerateRunbook={goGenerateRunbook}
          onImportDevices={(incoming) => setDevices((prev) => upsertMany(prev, incoming))}
        />
      )}

      {view === 'runbook' && plan && (
        <Runbook
          done={runbookDone}
          onBack={() => setView('matrix')}
          onToggleStep={(stepId) =>
            setRunbookDone((prev) => ({ ...prev, [stepId]: !prev[stepId] }))
          }
          plan={plan}
        />
      )}

      {view === 'runbook' && !plan && (
        <div className="mx-auto max-w-lg px-5 py-16 text-center">
          <p className="text-lg font-bold">No runbook yet</p>
          <button className="primary-button mt-4" onClick={goGenerateRunbook} type="button">
            Generate from matrix
          </button>
        </div>
      )}

      {helpOpen && (
        <div
          aria-modal
          className="fixed inset-0 z-50 grid place-items-center bg-[#17233c]/45 p-4"
          role="dialog"
        >
          <div className="max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">How this works</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#4d5a78]">
              <li>Everything stays in your browser (localStorage). No passwords are collected.</li>
              <li>
                Parents fill a device passport, then tap “Copy Link for This Device” — Andy opens
                the <code>#ci=</code> link to upsert that device.
              </li>
              <li>
                Andy’s Master Matrix flags shared Apple IDs, cross-wired Messages, legacy OS versions,
                and watch pairing risks, then builds a 3-phase <code>#plan=</code> runbook.
              </li>
            </ul>
            <button
              className="primary-button mt-5 w-full"
              onClick={() => setHelpOpen(false)}
              type="button"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
