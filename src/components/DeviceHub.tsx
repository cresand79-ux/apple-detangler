import { ArrowRight, Check, Clock, Copy, Lock, Mail, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { deviceSubtitle } from '../data/presets';
import {
  buildHouseholdShareUrl,
  copyText,
  emailHouseholdToAndrew,
} from '../lib/hashCodec';
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
  const [shareFlash, setShareFlash] = useState<string | null>(null);
  const checkedCount = devices.filter((d) => d.checked).length;
  const knownCount = devices.filter((d) => !d.isCustom).length;
  const allChecked = devices.length > 0 && checkedCount === devices.length;

  const flash = (message: string) => {
    setShareFlash(message);
    window.setTimeout(() => setShareFlash(null), 3500);
  };

  const copyShareLink = async () => {
    const url = buildHouseholdShareUrl(devices);
    const ok = await copyText(url);
    flash(
      ok
        ? 'Link copied — paste it into WhatsApp or an email to Andrew.'
        : 'Could not copy the link. Try Email Andrew instead.',
    );
  };

  const emailAndrew = async () => {
    if (!allChecked) {
      flash('Finish every device check first (green “Checked”), then try again.');
      return;
    }
    const result = await emailHouseholdToAndrew(devices);
    if (result === 'mailed') {
      flash('Opening email to Andrew with your results link…');
    } else if (result === 'copied-mailed') {
      flash('Link copied, and email opened — paste the link into the message if it is missing.');
    } else {
      flash('Could not open email. Use Copy link and paste it into a message to Andrew.');
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#5363b1]">
            Device selection hub · {checkedCount} of {devices.length} checked
          </p>
          <h1 className="text-[30px] font-bold tracking-[-.035em] md:text-[40px]">
            Which device are you checking?
          </h1>
          <p className="mt-2 max-w-2xl text-base text-[#68758c] md:text-[17px]">
            Choose a card for the Apple device you’re looking at, or add one that isn’t listed.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#e8f6f1] px-4 py-2 text-sm font-bold text-[#18765e]">
          <Lock size={16} /> No passwords needed
        </div>
      </div>

      <div className="mb-7 overflow-hidden rounded-2xl border border-[#f0d9b8] bg-[#fff8ef]">
        <div className="flex gap-4 p-5 md:px-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#c47a2c] text-white">
            <Users size={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#7a4a12]">
              Stay on this computer for every device
            </h2>
            <p className="mt-1 text-[15px] leading-6 text-[#6e5328]">
              Fill in all of the cards here—don’t switch to another phone or computer partway
              through. Answers only save in this browser; starting again elsewhere will look empty.
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

      <section className="mt-8 overflow-hidden rounded-2xl border border-[#ccd4f0] bg-white shadow-[0_10px_35px_rgba(31,44,78,.055)]">
        <div className="border-b border-[#e8ebf4] bg-[#eef1ff] px-5 py-4 md:px-6">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#5363b1]">
            When you are finished
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#243474]">Share with Andrew</h2>
        </div>
        <div className="space-y-4 px-5 py-5 md:px-6 md:py-6">
          <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-6 text-[#4d5a78]">
            <li>
              Complete every device card above until each one shows green{' '}
              <strong className="text-[#20745e]">Checked</strong> (
              {checkedCount} of {devices.length} done).
            </li>
            <li>
              Tap <strong>Email Andrew</strong> — your mail app opens to{' '}
              <span className="whitespace-nowrap">andy.cresswell@outlook.com</span> with the results
              link already in the message. Send it.
            </li>
            <li>
              Or tap <strong>Copy link</strong> and paste that link into WhatsApp or any email to
              Andrew.
            </li>
          </ol>
          {!allChecked && (
            <p className="rounded-xl border border-[#efdfa7] bg-[#fff7df] px-4 py-3 text-sm font-semibold text-[#8a6013]">
              {devices.length - checkedCount} device
              {devices.length - checkedCount === 1 ? '' : 's'} still not checked. Finish those first
              so Andrew gets the full picture.
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              className="primary-button"
              disabled={!allChecked}
              onClick={() => void emailAndrew()}
              type="button"
            >
              <Mail size={18} /> Email Andrew
            </button>
            <button
              className="secondary-button"
              disabled={!allChecked}
              onClick={() => void copyShareLink()}
              type="button"
            >
              <Copy size={18} /> Copy link
            </button>
          </div>
          {shareFlash && (
            <p className="rounded-xl border border-[#cce8de] bg-[#eaf7f2] px-4 py-3 text-sm font-semibold text-[#26705e]">
              {shareFlash}
            </p>
          )}
          <p className="text-sm leading-5 text-[#6d788c]">
            The link only contains what you typed here (emails and versions)—never passwords. Andrew
            opens it on his computer to review the Master Matrix.
          </p>
        </div>
      </section>
    </div>
  );
}
