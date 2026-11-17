import { ArrowRight, Check, Clock, Lock, Plus, Users } from 'lucide-react';
import { deviceSubtitle } from '../data/presets';
import type { DeviceCI } from '../types';
import { DeviceIconForName } from './DeviceIcon';

export function DeviceHub({
  devices,
  onSelect,
  onAdd,
}: {
  devices: DeviceCI[];
  onSelect: (device: DeviceCI) => void;
  onAdd: () => void;
}) {
  const checkedCount = devices.filter((d) => d.checked).length;
  const knownCount = devices.filter((d) => !d.isCustom).length;

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#5363b1]">
            Device selection hub · {checkedCount} of {devices.length} checked
          </p>
          <h1 className="text-[30px] font-bold tracking-[-.035em] md:text-[40px]">
            Which device are you holding?
          </h1>
          <p className="mt-2 max-w-2xl text-base text-[#68758c] md:text-[17px]">
            Choose a device to check its Apple Account details, or add one that isn’t listed.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#e8f6f1] px-4 py-2 text-sm font-bold text-[#18765e]">
          <Lock size={16} /> No passwords needed
        </div>
      </div>

      <div className="mb-7 overflow-hidden rounded-2xl border border-[#ccd4f0] bg-[#eef1ff]">
        <div className="flex gap-4 p-5 md:px-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#3f51ad] text-white">
            <Users size={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#243474]">
              Let’s account for every Apple device in the house
            </h2>
            <p className="mt-1 text-[15px] leading-6 text-[#4d5a78]">
              Tap the matching card on each device. Finished checks are marked in green. Progress
              auto-saves on this browser.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <button
            className="group min-h-[205px] rounded-2xl border border-[#dfe4ec] bg-white p-5 text-left shadow-[0_8px_28px_rgba(31,44,78,.045)] transition hover:-translate-y-0.5 hover:border-[#aeb9df] hover:shadow-[0_12px_32px_rgba(31,44,78,.09)]"
            key={device.id}
            onClick={() => onSelect(device)}
            type="button"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#edf0ff] text-[#4052ac]">
                <DeviceIconForName kind={device.kind} name={device.name} size={24} />
              </span>
              {device.checked ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f6f1] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.04em] text-[#20745e]">
                  <Check size={13} /> Checked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f4f8] px-2.5 py-1 text-[11px] font-bold text-[#6f7a8e]">
                  <Clock size={13} /> Not checked
                </span>
              )}
            </div>
            <h2 className="mt-6 text-lg font-bold tracking-[-.015em] text-[#202d47]">
              {device.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#737e92]">{deviceSubtitle(device)}</p>
            <span className="mt-5 flex items-center gap-1.5 text-sm font-bold text-[#4052a8]">
              Open device check{' '}
              <ArrowRight className="transition group-hover:translate-x-1" size={16} />
            </span>
          </button>
        ))}

        <button
          className="group min-h-[205px] rounded-2xl border-2 border-dashed border-[#b9c2d5] bg-[#fafbfe] p-5 text-center transition hover:-translate-y-0.5 hover:border-[#6676be] hover:bg-[#f4f6ff]"
          onClick={onAdd}
          type="button"
        >
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e9edfc] text-[#4052ac] transition group-hover:scale-105">
            <Plus size={28} />
          </span>
          <h2 className="mt-4 text-lg font-bold tracking-[-.015em] text-[#2a3751]">
            + Add Another Device
          </h2>
          <p className="mx-auto mt-1.5 max-w-[260px] text-sm leading-5 text-[#6e798e]">
            Found a spare iPad, Apple TV, or extra phone? Tap here.
          </p>
        </button>
      </div>

      <div className="mt-7 flex items-center justify-between rounded-xl border border-[#dfe4ec] bg-white px-5 py-4 text-sm">
        <span className="text-[#6d788c]">
          <strong className="text-[#344159]">
            {knownCount} known devices
            {devices.length > knownCount ? ` · ${devices.length - knownCount} added` : ''}
          </strong>{' '}
          in this household
        </span>
        <span className="font-bold text-[#4052a8]">{checkedCount} checks complete</span>
      </div>
    </div>
  );
}
