import {
  AlertTriangle,
  ArrowRight,
  Check,
  Download,
  Info,
  Upload,
} from 'lucide-react';
import { useRef } from 'react';
import { deviceSubtitle } from '../data/presets';
import { analyzeConflicts, statusForDevice } from '../lib/conflicts';
import type { ConflictSeverity, DeviceCI } from '../types';
import { DeviceIconForName } from './DeviceIcon';

function StatusBadge({ status }: { status: ConflictSeverity }) {
  const content = {
    conflict: ['Conflict', 'bg-[#fff0eb] text-[#a53c28] border-[#f4d1c8]'],
    review: ['Review', 'bg-[#fff7df] text-[#8a6013] border-[#efdfa7]'],
    clear: ['Looks good', 'bg-[#eaf7f2] text-[#26705e] border-[#cce8de]'],
  }[status];
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.05em] ${content[1]}`}
    >
      {content[0]}
    </span>
  );
}

export function Matrix({
  devices,
  onImportDevices,
  onGenerateRunbook,
}: {
  devices: DeviceCI[];
  onImportDevices: (devices: DeviceCI[]) => void;
  onGenerateRunbook: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const flags = analyzeConflicts(devices);
  const conflictCount = flags.filter((f) => f.severity === 'conflict').length;
  const reviewCount = flags.filter((f) => f.severity === 'review').length;
  const clearCount = devices.filter((d) => statusForDevice(d, flags) === 'clear').length;

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ devices, flags }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'apple-account-device-matrix.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { devices?: DeviceCI[] } | DeviceCI[];
      const list = Array.isArray(parsed) ? parsed : parsed.devices;
      if (Array.isArray(list) && list.length) onImportDevices(list);
    } catch {
      window.alert('Could not read that JSON file.');
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#5363b1]">
            Andy’s planner · {devices.length} devices
          </p>
          <h1 className="text-[30px] font-bold tracking-[-.035em] md:text-[40px]">
            Andy’s Master Matrix
          </h1>
          <p className="mt-2 max-w-2xl text-base text-[#68758c]">
            Every known device—including newly added ones—in one conflict map. Incoming{' '}
            <code className="rounded bg-[#eef1ff] px-1.5 py-0.5 text-sm">#ci=</code> links upsert
            automatically.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <input
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
            ref={fileInput}
            type="file"
          />
          <button
            className="secondary-button"
            onClick={() => fileInput.current?.click()}
            type="button"
          >
            <Upload size={18} /> Import JSON
          </button>
          <button className="secondary-button" onClick={exportData} type="button">
            <Download size={18} /> Export
          </button>
          <button className="primary-button" onClick={onGenerateRunbook} type="button">
            Generate Custom Runbook <ArrowRight size={19} />
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="summary-card">
          <span className="summary-icon bg-[#fff0eb] text-[#b44d36]">
            <AlertTriangle size={19} />
          </span>
          <div>
            <strong>
              {conflictCount} conflict{conflictCount === 1 ? '' : 's'}
            </strong>
            <span>Need attention first</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon bg-[#fff7df] text-[#946819]">
            <Info size={19} />
          </span>
          <div>
            <strong>
              {reviewCount} review item{reviewCount === 1 ? '' : 's'}
            </strong>
            <span>Shared purchases / watch / iMessage</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon bg-[#eaf7f2] text-[#27745f]">
            <Check size={19} />
          </span>
          <div>
            <strong>
              {clearCount} device{clearCount === 1 ? '' : 's'} clear
            </strong>
            <span>No primary conflict</span>
          </div>
        </div>
      </div>

      {flags.length > 0 && (
        <div className="mb-5 space-y-2 rounded-2xl border border-[#f0d5cc] bg-[#fff8f6] p-4 md:p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[.08em] text-[#9e4935]">
            Conflict engine
          </h2>
          <ul className="space-y-2">
            {flags.map((f) => (
              <li className="flex items-start gap-2 text-sm text-[#5c3a32]" key={f.id}>
                {f.severity === 'conflict' ? (
                  <AlertTriangle className="mt-0.5 shrink-0 text-[#b44d36]" size={16} />
                ) : (
                  <Info className="mt-0.5 shrink-0 text-[#946819]" size={16} />
                )}
                <span>
                  <strong className="font-bold">{f.title}.</strong> {f.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#dfe4ec] bg-white shadow-[0_12px_38px_rgba(31,44,78,.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left">
            <caption className="sr-only">Apple accounts and services by device</caption>
            <thead>
              <tr className="border-b border-[#dfe4ec] bg-[#f8f9fc]">
                {[
                  'Device & owner',
                  'OS version',
                  'Primary Apple Account',
                  'Media & Purchases',
                  'Messages / FaceTime',
                  'Status',
                ].map((heading) => (
                  <th
                    className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[.08em] text-[#667187]"
                    key={heading}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => {
                const status = statusForDevice(device, flags);
                const alert = flags.find((f) => f.deviceIds.includes(device.id))?.title;
                return (
                  <tr
                    className={`border-b border-[#e8ebf1] align-top last:border-0 hover:bg-[#fafbfe] ${
                      device.isCustom ? 'bg-[#f9faff]' : ''
                    }`}
                    key={device.id}
                  >
                    <td className="px-5 py-4.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf0fb] text-[#4354a5]">
                          <DeviceIconForName kind={device.kind} name={device.name} size={19} />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="block text-sm">{device.name}</strong>
                            {device.isCustom && (
                              <span className="rounded-md border border-[#ccd4ee] bg-[#eef1ff] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[.07em] text-[#5363a8]">
                                Added
                              </span>
                            )}
                          </div>
                          <span className="mt-0.5 block text-xs text-[#758094]">{device.owner}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-sm font-medium text-[#465269]">
                      {deviceSubtitle(device)}
                    </td>
                    <td className="px-5 py-5 text-sm font-medium text-[#37445c]">
                      {device.platform === 'watchOS'
                        ? device.watchPaired || 'Paired to iPhone?'
                        : device.primaryAppleId || '—'}
                    </td>
                    <td className="px-5 py-5 text-sm font-medium text-[#37445c]">
                      {device.platform === 'watchOS' ? '—' : device.mediaPurchases || '—'}
                    </td>
                    <td className="px-5 py-5 text-sm font-medium text-[#37445c]">
                      {device.messagesFaceTime || '—'}
                    </td>
                    <td className="w-[225px] px-5 py-5">
                      <StatusBadge status={status} />
                      {alert && (
                        <div
                          className={`mt-2 flex items-start gap-1.5 text-xs font-semibold leading-4 ${
                            status === 'conflict' ? 'text-[#9e4935]' : 'text-[#8b651d]'
                          }`}
                        >
                          {status === 'conflict' ? (
                            <AlertTriangle className="mt-px shrink-0" size={14} />
                          ) : (
                            <Info className="mt-px shrink-0" size={14} />
                          )}
                          {alert}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#e5e9f0] bg-[#fafbfc] px-5 py-3 text-xs font-medium text-[#707b8f]">
          <span>Custom devices are included automatically</span>
          <span>
            {devices.length} of {devices.length} devices shown
          </span>
        </div>
      </div>
    </div>
  );
}
