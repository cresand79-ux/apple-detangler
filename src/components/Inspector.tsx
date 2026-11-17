import { ArrowRight, Check, Copy, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { kindToPlatform } from '../data/presets';
import { buildShareUrl, copyText, encodeCi } from '../lib/hashCodec';
import type { DeviceCI, DeviceType, Owner } from '../types';
import {
  GuideGeneralAbout,
  GuideMediaPurchases,
  GuideMessagesSendReceive,
  GuideNameAtTop,
  GuideWatchAbout,
} from './guides/SettingsGuides';
import { Field, SelectField, StepHeader } from './ui';

export function Inspector({
  device,
  indexLabel,
  onChange,
  onBack,
  onRemove,
  onMarkChecked,
}: {
  device: DeviceCI;
  indexLabel: string;
  onChange: (next: DeviceCI) => void;
  onBack: () => void;
  onRemove: () => void;
  onMarkChecked: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const isWatch = device.platform === 'watchOS';

  const patch = (partial: Partial<DeviceCI>) => {
    onChange({
      ...device,
      ...partial,
      updatedAt: new Date().toISOString(),
    });
  };

  const copyDeviceLink = async () => {
    const url = buildShareUrl(`#ci=${encodeCi(device)}`);
    const ok = await copyText(url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const finish = () => {
    onMarkChecked();
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  };

  return (
    <div className="mx-auto max-w-[1040px] px-5 py-8 md:px-8 md:py-10">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#5363b1]">
          {device.isCustom ? 'Custom device' : indexLabel} · Expanded device inspector
        </p>
        <h1 className="text-[30px] font-bold tracking-[-.035em] md:text-[40px]">{device.name}</h1>
        <p className="mt-2 text-base text-[#68758c]">
          Fill in what you see on this device—no passwords needed. Answers auto-save as you type.
        </p>
      </div>

      {device.isCustom && (
        <section className="mb-6 rounded-2xl border border-[#cbd3ef] bg-[#eef1ff] p-5 shadow-[0_8px_24px_rgba(41,58,145,.06)] md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-[#293a7e]">Set up this extra device</h2>
              <p className="mt-0.5 text-sm text-[#657091]">You can change these details later.</p>
            </div>
            <button
              className="shrink-0 text-sm font-bold text-[#8b5060] underline-offset-4 hover:underline"
              onClick={onRemove}
              type="button"
            >
              Remove Device
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label>
              <span className="mb-1.5 block text-xs font-extrabold text-[#4f5d80]">Device Name</span>
              <input
                className="field-input !h-12"
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g., Kitchen iPad"
                value={device.name}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-extrabold text-[#4f5d80]">
                Intended Owner
              </span>
              <SelectField
                onChange={(value) => patch({ owner: value as Owner })}
                value={device.owner}
              >
                <option>Mum</option>
                <option>Dad</option>
                <option>Shared</option>
              </SelectField>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-extrabold text-[#4f5d80]">Device Type</span>
              <SelectField
                onChange={(value) => {
                  const kind = value as DeviceType;
                  patch({ kind, platform: kindToPlatform(kind) });
                }}
                value={device.kind}
              >
                <option>iPhone</option>
                <option>iPad</option>
                <option>Mac</option>
                <option>Apple Watch</option>
              </SelectField>
            </label>
          </div>
        </section>
      )}

      <section className="mb-6 overflow-hidden rounded-2xl border border-[#ccd4f0] bg-[#eef1ff]">
        <div className="flex gap-4 p-5 md:p-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#3f51ad] text-white">
            <Smartphone size={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#243474]">Open Settings on {device.name}</h2>
            <p className="mt-1 text-[15px] leading-6 text-[#4d5a78]">
              Copy only the email addresses and version numbers you can see. Never type a password
              here.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        {isWatch ? (
          <>
            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8">
              <StepHeader
                n={1}
                subtitle="Confirm which iPhone owns this watch before any sign-out."
                title="Pairing check"
              />
              <div className="grid gap-6 lg:grid-cols-2">
                <Field
                  hint="On the paired iPhone: open the Watch app → My Watch"
                  label="Is this watch paired, and to which phone?"
                >
                  <SelectField
                    onChange={(v) =>
                      patch({
                        watchPaired: v as DeviceCI['watchPaired'],
                      })
                    }
                    value={device.watchPaired}
                  >
                    <option value="">Select…</option>
                    <option>Yes — paired to Mum’s iPhone</option>
                    <option>Yes — paired to Dad’s iPhone</option>
                    <option>Not paired / unknown</option>
                  </SelectField>
                </Field>
                <GuideWatchAbout />
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8">
              <StepHeader
                n={2}
                subtitle="Watch app → General → About"
                title="watchOS version"
              />
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <Field hint="Watch app → General → About → Software Version" label="watchOS version">
                    <input
                      className="field-input"
                      onChange={(e) => patch({ watchVersion: e.target.value, softwareVersion: e.target.value })}
                      placeholder="e.g., 10.5"
                      value={device.watchVersion || device.softwareVersion}
                    />
                  </Field>
                  <Field label="Device name shown on About">
                    <input
                      className="field-input"
                      onChange={(e) => patch({ deviceNameSeen: e.target.value })}
                      placeholder={device.name}
                      value={device.deviceNameSeen}
                    />
                  </Field>
                </div>
                <GuideWatchAbout />
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8">
              <StepHeader
                n={3}
                subtitle="Do this before signing out of the primary iPhone."
                title="Pairing verification before sign-out"
              />
              <Field label="Have you re-checked pairing on the Watch app today?">
                <SelectField
                  onChange={(v) =>
                    patch({
                      pairingVerifiedBeforeSignOut: v as DeviceCI['pairingVerifiedBeforeSignOut'],
                    })
                  }
                  value={device.pairingVerifiedBeforeSignOut}
                >
                  <option value="">Select…</option>
                  <option>Yes — switched on</option>
                  <option>No — switched off</option>
                  <option>Not sure</option>
                </SelectField>
              </Field>
              <p className="mt-4 rounded-xl border border-[#f4d1c8] bg-[#fff0eb] px-4 py-3 text-sm font-semibold text-[#9e4935]">
                Signing the paired iPhone out of Apple ID can disrupt the watch. Verify pairing
                first, then follow Andy’s runbook.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8">
              <StepHeader
                n={1}
                subtitle="Find the name and current software."
                title="About this device"
              />
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <Field hint="Open Settings → General → About → Name" label="Device name">
                    <input
                      className="field-input"
                      onChange={(e) => patch({ deviceNameSeen: e.target.value })}
                      placeholder={device.name}
                      value={device.deviceNameSeen}
                    />
                  </Field>
                  <Field
                    hint="Open Settings → General → About → Software Version"
                    label="Software version"
                  >
                    <input
                      className="field-input"
                      onChange={(e) => patch({ softwareVersion: e.target.value })}
                      placeholder={
                        device.platform === 'macOS' ? 'e.g., 14.5' : 'e.g., 17.5.1'
                      }
                      value={device.softwareVersion}
                    />
                  </Field>
                </div>
                <GuideGeneralAbout />
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8">
              <StepHeader
                n={2}
                subtitle="Email addresses only—never enter a password."
                title="Accounts shown on screen"
              />
              <div className="grid gap-8">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Field label="Primary Apple Account" hint="Settings → tap the Name at the top">
                    <input
                      className="field-input"
                      onChange={(e) => patch({ primaryAppleId: e.target.value })}
                      placeholder="name@example.com"
                      type="email"
                      value={device.primaryAppleId}
                    />
                  </Field>
                  <GuideNameAtTop />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Field
                    hint="Settings → Name → Media & Purchases → View Account"
                    label="Media & Purchases"
                  >
                    <input
                      className="field-input"
                      onChange={(e) => patch({ mediaPurchases: e.target.value })}
                      placeholder="name@example.com"
                      type="email"
                      value={device.mediaPurchases}
                    />
                  </Field>
                  <GuideMediaPurchases />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Field
                    hint="Settings → Apps → Messages → Send & Receive"
                    label="Messages & FaceTime use"
                  >
                    <SelectField
                      onChange={(v) =>
                        patch({ messagesFaceTime: v as DeviceCI['messagesFaceTime'] })
                      }
                      value={device.messagesFaceTime}
                    >
                      <option value="">Select…</option>
                      <option>Shared family email</option>
                      <option>Personal email</option>
                      <option>Phone number only</option>
                      <option>Not sure</option>
                    </SelectField>
                  </Field>
                  <GuideMessagesSendReceive />
                </div>
                <Field
                  hint="Settings → Name → iCloud → Show All → Contacts"
                  label="Are Contacts saved to iCloud?"
                >
                  <SelectField
                    onChange={(v) => patch({ contactsIcloud: v as DeviceCI['contactsIcloud'] })}
                    value={device.contactsIcloud}
                  >
                    <option value="">Select…</option>
                    <option>Yes — switched on</option>
                    <option>No — switched off</option>
                    <option>Not sure</option>
                  </SelectField>
                </Field>
              </div>
            </section>
          </>
        )}

        <div className="sticky bottom-0 z-20 -mx-5 border-t border-[#dfe4ee] bg-white/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <button className="secondary-button" onClick={onBack} type="button">
              Back to All Devices
            </button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="secondary-button" onClick={copyDeviceLink} type="button">
                {copied ? (
                  <>
                    <Check size={18} /> Link copied
                  </>
                ) : (
                  <>
                    <Copy size={18} /> Copy Link for This Device to Send to Andy
                  </>
                )}
              </button>
              <button className="primary-button min-w-[220px]" onClick={finish} type="button">
                {savedFlash ? (
                  <>
                    <Check size={18} /> Saved
                  </>
                ) : (
                  <>
                    Save Device Check <ArrowRight size={19} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
