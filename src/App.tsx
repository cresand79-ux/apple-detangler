import { useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/AppShell';
import { DeviceHub } from './components/DeviceHub';
import { Inspector } from './components/Inspector';
import { Matrix } from './components/Matrix';
import { Runbook } from './components/Runbook';
import { createCustomDevice } from './data/presets';
import { modeFromPath, navigateToMode, restoreGhPagesRedirect, type AppMode } from './lib/appMode';
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

function initialView(mode: AppMode): View {
  return mode === 'planner' ? 'matrix' : 'hub';
}

export default function App() {
  const [mode, setMode] = useState<AppMode>(() => {
    restoreGhPagesRedirect();
    return modeFromPath();
  });
  const [view, setView] = useState<View>(() => initialView(modeFromPath()));
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

  useEffect(() => {
    saveDevices(devices);
  }, [devices]);

  useEffect(() => {
    saveSelectedId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    saveRunbookDone(runbookDone);
  }, [runbookDone]);

  useEffect(() => {
    const syncMode = () => {
      const next = modeFromPath();
      setMode(next);
      setView((current) => {
        if (next === 'planner' && (current === 'hub' || current === 'inspector')) return 'matrix';
        if (next === 'collect' && (current === 'matrix' || current === 'runbook')) return 'hub';
        return current;
      });
    };
    window.addEventListener('popstate', syncMode);
    return () => window.removeEventListener('popstate', syncMode);
  }, []);

  // Ingest #ci= / #plan= hashes
  useEffect(() => {
    const ingest = () => {
      const parsed = parseHash();
      if (!parsed) return;

      if (parsed.kind === 'ci') {
        const ci = decodeCi(parsed.payload);
        if (!ci) {
          setHashNotice('Could not read that device link.');
          return;
        }
        if (modeFromPath() !== 'collect') navigateToMode('collect');
        setMode('collect');
        setDevices((prev) => upsertDevice(prev, ci));
        setSelectedId(ci.id);
        setView('inspector');
        setHashNotice(`Imported device passport: ${ci.name}`);
        return;
      }

      if (parsed.kind === 'plan') {
        const master = decodePlan(parsed.payload);
        if (!master) {
          setHashNotice('Could not read that runbook link.');
          return;
        }
        if (modeFromPath() !== 'planner') navigateToMode('planner');
        setMode('planner');
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
      mode={mode}
      onHelp={() => setHelpOpen(true)}
      setView={(v) => {
        if (mode === 'collect' && (v === 'matrix' || v === 'runbook')) return;
        if (mode === 'planner' && (v === 'hub' || v === 'inspector')) return;
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

      {mode === 'collect' && view === 'hub' && (
        <DeviceHub devices={devices} onAdd={addDevice} onSelect={selectDevice} />
      )}

      {mode === 'collect' && view === 'inspector' && selected && (
        <Inspector
          device={selected}
          householdDevices={devices}
          indexLabel={presetIndexLabel}
          onBack={() => setView('hub')}
          onChange={updateDevice}
          onMarkChecked={markChecked}
          onRemove={removeSelected}
        />
      )}

      {mode === 'collect' && view === 'inspector' && !selected && (
        <div className="mx-auto max-w-lg px-5 py-16 text-center">
          <p className="text-lg font-bold">No device selected</p>
          <button className="primary-button mt-4" onClick={() => setView('hub')} type="button">
            Back to devices
          </button>
        </div>
      )}

      {mode === 'planner' && view === 'matrix' && (
        <Matrix
          devices={devices}
          onGenerateRunbook={goGenerateRunbook}
          onImportDevices={(incoming) => setDevices((prev) => upsertMany(prev, incoming))}
        />
      )}

      {mode === 'planner' && view === 'runbook' && plan && (
        <Runbook
          done={runbookDone}
          onBack={() => setView('matrix')}
          onToggleStep={(stepId) =>
            setRunbookDone((prev) => ({ ...prev, [stepId]: !prev[stepId] }))
          }
          plan={plan}
        />
      )}

      {mode === 'planner' && view === 'runbook' && !plan && (
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
            {mode === 'collect' ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#4d5a78]">
                <li>Everything stays in your browser. No passwords are collected.</li>
                <li>
                  Stay on one computer for every device card—don’t switch browsers or devices
                  partway through.
                </li>
                <li>Open each device card and copy only what you see on screen (emails and versions).</li>
              </ul>
            ) : (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#4d5a78]">
                <li>
                  This planner page is for Andrew. Parents use the main collect link (Devices), not
                  this URL.
                </li>
                <li>
                  On the same computer parents used, answers appear here automatically from that
                  browser’s saved data.
                </li>
                <li>
                  The Master Matrix flags shared Apple IDs, Messages issues, legacy OS versions, and
                  watch pairing—then builds a 3-phase runbook.
                </li>
              </ul>
            )}
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
