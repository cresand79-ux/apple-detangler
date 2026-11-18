import { ArrowRight, Check, Smartphone } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { kindToPlatform } from '../data/presets';
import { usesLegacyMacSystemPreferences } from '../lib/macUi';
import type { DeviceCI, DeviceType, Owner } from '../types';
import {
  GuideContactsIcloud,
  GuideDevicesOnAccount,
  GuideGeneralAbout,
  GuideIpadAbout,
  GuideIpadAppleId,
  GuideIpadContactsIcloud,
  GuideIpadDevicesOnAccount,
  GuideIpadMediaPurchases,
  GuideIpadMessages,
  GuideMacAbout,
  GuideMacAppleAccount,
  GuideMacContactsIcloud,
  GuideMacDevicesOnAccount,
  GuideMacLegacyAbout,
  GuideMacLegacyAppleId,
  GuideMacLegacyContactsIcloud,
  GuideMacLegacyDevicesOnAccount,
  GuideMacLegacyMediaPurchases,
  GuideMacLegacyMessages,
  GuideMacMediaPurchases,
  GuideMacMessages,
  GuideMediaPurchases,
  GuideMessagesSendReceive,
  GuideNameAtTop,
  GuideWatchAbout,
  GuideWatchMyWatch,
} from './guides/SettingsGuides';
import { DeviceIconForName } from './DeviceIcon';
import { PathHint, SelectField, StepHeader } from './ui';

function softwareVersionLabel(platform: DeviceCI['platform']): string {
  if (platform === 'iOS') return 'iOS Version';
  if (platform === 'iPadOS') return 'iPadOS Version';
  if (platform === 'macOS') return 'macOS version';
  return 'Software version';
}

function softwareVersionHint(device: DeviceCI): string {
  if (device.platform === 'iPadOS') {
    return 'Settings → General → About → iPadOS Version';
  }
  if (device.platform === 'iOS') {
    return 'Settings → General → About → iOS Version';
  }
  if (device.platform === 'macOS') {
    return usesLegacyMacSystemPreferences(device)
      ? ' → About This Mac (Monterey / Big Sur show version here)'
      : 'System Settings → General → About (or  → About This Mac)';
  }
  return 'Open Settings → General → About → Software Version';
}

function deviceNameHint(device: DeviceCI): string {
  if (device.platform === 'iOS' || device.platform === 'iPadOS') {
    return 'Settings → General → About → Name';
  }
  if (device.platform === 'macOS') {
    return usesLegacyMacSystemPreferences(device)
      ? 'System Preferences → Sharing → Computer Name'
      : 'System Settings → General → About → Name';
  }
  return 'Open Settings → General → About → Name';
}

function appleAccountHint(device: DeviceCI): string {
  if (device.platform === 'macOS') {
    return usesLegacyMacSystemPreferences(device)
      ? ' → System Preferences… → Apple ID (top of window) → Overview — copy the email under your name'
      : 'System Settings → click your name (Apple Account) — copy the email under your name';
  }
  if (device.platform === 'iPadOS') {
    return 'iPad Settings (two columns): left sidebar → tap your name (Apple ID, iCloud, Media & Purchases) — email appears in the right pane';
  }
  return 'Settings → tap your name (Apple Account, iCloud and more) — copy the email under your name';
}

function appleAccountLabel(device: DeviceCI): string {
  if (device.platform === 'iPadOS') return 'Apple ID';
  if (device.platform === 'macOS' && usesLegacyMacSystemPreferences(device)) return 'Apple ID';
  return 'Apple Account';
}

function mediaPurchasesHint(device: DeviceCI): string {
  if (device.platform === 'macOS') {
    return usesLegacyMacSystemPreferences(device)
      ? 'System Preferences → Apple ID → Media & Purchases'
      : 'System Settings → Apple Account → Media & Purchases → Account → Manage…';
  }
  if (device.platform === 'iPadOS') {
    return 'Left sidebar → your Apple ID; right pane → Media & Purchases';
  }
  return 'Apple Account → Media & Purchases → Account Settings → Apple Account';
}

function messagesHint(device: DeviceCI): string {
  if (device.platform === 'macOS') {
    return usesLegacyMacSystemPreferences(device)
      ? 'Messages app → Messages menu → Preferences… → iMessage → You can be reached for messages at…'
      : 'Messages app → Messages menu → Settings… → iMessage → You can be reached for messages at…';
  }
  if (device.platform === 'iPadOS') {
    return 'Left sidebar → Messages (not under Apps); right pane → Send & Receive';
  }
  return 'Settings → Apps → Messages → Send & Receive';
}

function contactsIcloudHint(device: DeviceCI): string {
  if (device.platform === 'macOS') {
    return usesLegacyMacSystemPreferences(device)
      ? 'System Preferences → Apple ID → iCloud → Apps using iCloud → Contacts'
      : 'System Settings → Apple Account → iCloud → Saved to iCloud → See All → Contacts';
  }
  if (device.platform === 'iPadOS') {
    return 'Right pane: Apple ID → iCloud → Apps Using iCloud → Show All → Contacts';
  }
  return 'Apple Account → iCloud → Saved to iCloud → See All → Contacts';
}

function devicesOnAccountHint(device: DeviceCI): string {
  if (device.platform === 'macOS') {
    return usesLegacyMacSystemPreferences(device)
      ? 'System Preferences → Apple ID → device list at the bottom of the left sidebar'
      : 'System Settings → Apple Account → scroll to Devices';
  }
  if (device.platform === 'iPadOS') {
    return 'Still on your Apple ID: scroll the right pane to Devices';
  }
  return 'Still on Apple Account: scroll down to the Devices list';
}

/** Title → short what-to-look-for → mockup → entry controls */
function CollectBlock({
  title,
  description,
  hint,
  guide,
  children,
}: {
  title: string;
  description: string;
  hint?: string;
  guide?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <span className="mb-2 block text-[15px] font-bold text-[#23304a] md:text-[18px]">
          {title}
        </span>
        <p className="text-sm leading-5 text-[#68758c]">{description}</p>
        {hint && <PathHint>{hint}</PathHint>}
      </div>
      {guide}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function Inspector({
  device,
  householdDevices,
  indexLabel,
  onChange,
  onBack,
  onRemove,
  onMarkChecked,
}: {
  device: DeviceCI;
  householdDevices: DeviceCI[];
  indexLabel: string;
  onChange: (next: DeviceCI) => void;
  onBack: () => void;
  onRemove: () => void;
  onMarkChecked: () => void;
}) {
  const [savedFlash, setSavedFlash] = useState(false);
  const isWatch = device.platform === 'watchOS';
  const legacyMacPrefs = usesLegacyMacSystemPreferences(device);
  const linkedIds = new Set(device.devicesOnAccount ?? []);

  const patch = (partial: Partial<DeviceCI>) => {
    onChange({
      ...device,
      ...partial,
      updatedAt: new Date().toISOString(),
    });
  };

  const toggleLinkedDevice = (id: string) => {
    const next = new Set(linkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    patch({ devicesOnAccount: [...next] });
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
            <h2 className="text-lg font-bold text-[#243474]">
              {isWatch
                ? device.owner === 'Mum'
                  ? `Use Mum’s iPhone — not the watch itself`
                  : device.owner === 'Dad'
                    ? `Use Dad’s iPhone — not the watch itself`
                    : `Use the paired iPhone — not the watch itself`
                : device.platform === 'macOS'
                  ? legacyMacPrefs
                    ? `Open System Preferences on ${device.name}`
                    : `Open System Settings on ${device.name}`
                  : `Open Settings on ${device.name}`}
            </h2>
            <p className="mt-1 text-[15px] leading-6 text-[#4d5a78]">
              {isWatch
                ? device.owner === 'Mum'
                  ? 'Apple Watch details live in the Watch app on Mum’s iPhone. You only look—nothing needs changing or unpairing.'
                  : device.owner === 'Dad'
                    ? 'Apple Watch details live in the Watch app on Dad’s iPhone. You only look—nothing needs changing or unpairing.'
                    : 'Apple Watch details live in the Watch app on the iPhone it is paired with. You only look—nothing needs changing or unpairing.'
                : 'Work through each numbered area in order—finish one menu before moving on. Copy only emails and version numbers. Never type a password here.'}
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
                subtitle={
                  device.owner === 'Mum'
                    ? 'Start on Mum’s iPhone (this watch almost certainly lives there).'
                    : device.owner === 'Dad'
                      ? 'Start on Dad’s iPhone (this watch almost certainly lives there).'
                      : 'Start on the iPhone this watch usually sits with.'
                }
                title="Which iPhone shows this watch?"
              />
              <CollectBlock
                description={
                  device.owner === 'Mum'
                    ? 'On Mum’s iPhone, open the Watch app (black watch-face icon). If My Watch shows this Apple Watch, choose Mum’s iPhone below. Only try Dad’s iPhone if it isn’t listed on Mum’s phone. You’re just reading the screen—don’t tap Unpair or change settings.'
                    : device.owner === 'Dad'
                      ? 'On Dad’s iPhone, open the Watch app (black watch-face icon). If My Watch shows this Apple Watch, choose Dad’s iPhone below. Only try Mum’s iPhone if it isn’t listed on Dad’s phone. You’re just reading the screen—don’t tap Unpair or change settings.'
                      : 'Open the Watch app (black watch-face icon) on Mum’s or Dad’s iPhone. Whichever phone lists this Apple Watch under My Watch is the one it’s paired with. You’re just reading the screen—don’t tap Unpair or change settings.'
                }
                guide={<GuideWatchMyWatch />}
                hint="iPhone → Watch app → My Watch"
                title="This watch appears in the Watch app on…"
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
              </CollectBlock>
            </section>

            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8">
              <StepHeader
                n={2}
                subtitle="Stay on that same iPhone’s Watch app."
                title="Name and watchOS version"
              />
              <CollectBlock
                description="On that iPhone: Watch app → My Watch → General → About. Copy the Name and Software Version exactly as shown."
                guide={<GuideWatchAbout />}
                hint="Watch app → My Watch → General → About"
                title="About this watch"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#23304a]">
                    Device name shown on About
                  </span>
                  <input
                    className="field-input"
                    onChange={(e) => patch({ deviceNameSeen: e.target.value })}
                    placeholder={device.name}
                    value={device.deviceNameSeen}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#23304a]">
                    watchOS version
                  </span>
                  <input
                    className="field-input"
                    onChange={(e) =>
                      patch({ watchVersion: e.target.value, softwareVersion: e.target.value })
                    }
                    placeholder="e.g., 10.5"
                    value={device.watchVersion || device.softwareVersion}
                  />
                </label>
                <p className="rounded-xl border border-[#d5dced] bg-[#f5f7fc] px-4 py-3 text-sm leading-5 text-[#4d5a78]">
                  That’s everything for the watch. Andrew’s runbook will say when (and if) anything
                  should change on Mum’s or Dad’s iPhone—you don’t need to unpair or sign out here.
                </p>
              </CollectBlock>
            </section>
          </>
        ) : (
          <>
            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8">
              <StepHeader
                n={1}
                subtitle={
                  device.platform === 'macOS'
                    ? legacyMacPrefs
                      ? 'Stay in System Preferences → Apple ID for every item below.'
                      : 'Stay in System Settings → Apple Account for every item below.'
                    : device.platform === 'iPadOS'
                      ? 'Stay on your Apple ID in Settings for every item below.'
                      : 'Stay under your name in Settings for every item below.'
                }
                title={
                  device.platform === 'iPadOS' || legacyMacPrefs
                    ? 'Apple ID'
                    : 'Apple Account'
                }
              />
              <div className="grid gap-10">
                <CollectBlock
                  description="Copy the email address shown under the name on this screen."
                  guide={
                    device.platform === 'iOS' ? (
                      <GuideNameAtTop />
                    ) : device.platform === 'iPadOS' ? (
                      <GuideIpadAppleId />
                    ) : legacyMacPrefs ? (
                      <GuideMacLegacyAppleId />
                    ) : (
                      <GuideMacAppleAccount />
                    )
                  }
                  hint={appleAccountHint(device)}
                  title={appleAccountLabel(device)}
                >
                  <input
                    className="field-input"
                    onChange={(e) => patch({ primaryAppleId: e.target.value })}
                    placeholder="name@example.com"
                    type="email"
                    value={device.primaryAppleId}
                  />
                </CollectBlock>

                <CollectBlock
                  description="Open iCloud and note whether Contacts is switched on for this account."
                  guide={
                    device.platform === 'iOS' ? (
                      <GuideContactsIcloud />
                    ) : device.platform === 'iPadOS' ? (
                      <GuideIpadContactsIcloud />
                    ) : legacyMacPrefs ? (
                      <GuideMacLegacyContactsIcloud />
                    ) : (
                      <GuideMacContactsIcloud />
                    )
                  }
                  hint={contactsIcloudHint(device)}
                  title="Contacts in iCloud"
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
                </CollectBlock>

                <CollectBlock
                  description="Copy the email used for Media & Purchases (App Store / iTunes purchases)."
                  guide={
                    device.platform === 'iOS' ? (
                      <GuideMediaPurchases />
                    ) : device.platform === 'iPadOS' ? (
                      <GuideIpadMediaPurchases />
                    ) : legacyMacPrefs ? (
                      <GuideMacLegacyMediaPurchases />
                    ) : (
                      <GuideMacMediaPurchases />
                    )
                  }
                  hint={mediaPurchasesHint(device)}
                  title="Media & Purchases"
                >
                  <input
                    className="field-input"
                    onChange={(e) => patch({ mediaPurchases: e.target.value })}
                    placeholder="name@example.com"
                    type="email"
                    value={device.mediaPurchases}
                  />
                </CollectBlock>

                <CollectBlock
                  description="Look at the Devices list on screen. Tick every household card that appears there. If the list shows anything that isn’t one of these cards, type that name below."
                  guide={
                    device.platform === 'iOS' ? (
                      <GuideDevicesOnAccount />
                    ) : device.platform === 'iPadOS' ? (
                      <GuideIpadDevicesOnAccount />
                    ) : legacyMacPrefs ? (
                      <GuideMacLegacyDevicesOnAccount />
                    ) : (
                      <GuideMacDevicesOnAccount />
                    )
                  }
                  hint={devicesOnAccountHint(device)}
                  title="Devices on this account"
                >
                  <div className="space-y-2">
                    {householdDevices.map((item) => {
                      const checked = linkedIds.has(item.id);
                      return (
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${
                            checked
                              ? 'border-[#a8b6e8] bg-[#eef1ff]'
                              : 'border-[#dfe4ec] bg-white hover:border-[#c5cde3]'
                          }`}
                          key={item.id}
                        >
                          <input
                            checked={checked}
                            className="h-4 w-4 shrink-0 accent-[#4052ac]"
                            onChange={() => toggleLinkedDevice(item.id)}
                            type="checkbox"
                          />
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#edf0ff] text-[#4052ac]">
                            <DeviceIconForName kind={item.kind} name={item.name} size={18} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-[#23304a]">
                              {item.name}
                              {item.id === device.id ? ' (this device)' : ''}
                            </span>
                            <span className="block text-xs text-[#737e92]">
                              {item.owner} · {item.kind}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-[#23304a]">
                      Other devices listed
                    </span>
                    <textarea
                      className="field-input min-h-[88px] resize-y py-3"
                      onChange={(e) => patch({ otherDevicesOnAccount: e.target.value })}
                      placeholder="e.g. Old iPhone 7, Apple TV lounge…"
                      value={device.otherDevicesOnAccount}
                    />
                  </label>
                </CollectBlock>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8">
              <StepHeader
                n={2}
                subtitle={
                  device.platform === 'macOS'
                    ? legacyMacPrefs
                      ? ' → About This Mac for version; System Preferences → Sharing for Computer Name.'
                      : 'System Settings → General → About.'
                    : device.platform === 'iPadOS'
                      ? 'Left sidebar → General; right pane → About.'
                      : 'Settings → General → About.'
                }
                title="About this device"
              />
              <CollectBlock
                description="Copy the device Name and the software version exactly as shown on screen."
                guide={
                  device.platform === 'iOS' ? (
                    <GuideGeneralAbout />
                  ) : device.platform === 'iPadOS' ? (
                    <GuideIpadAbout />
                  ) : legacyMacPrefs ? (
                    <GuideMacLegacyAbout />
                  ) : (
                    <GuideMacAbout />
                  )
                }
                hint={`${deviceNameHint(device)} · ${softwareVersionHint(device)}`}
                title="Name and version"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#23304a]">Name</span>
                  <input
                    className="field-input"
                    onChange={(e) => patch({ deviceNameSeen: e.target.value })}
                    placeholder={device.name}
                    value={device.deviceNameSeen}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#23304a]">
                    {softwareVersionLabel(device.platform)}
                  </span>
                  <input
                    className="field-input"
                    onChange={(e) => patch({ softwareVersion: e.target.value })}
                    placeholder={
                      device.platform === 'macOS'
                        ? legacyMacPrefs
                          ? 'e.g., 12.7.6'
                          : 'e.g., 15.1'
                        : device.platform === 'iPadOS'
                          ? 'e.g., 16.6.1'
                          : 'e.g., 17.0.1'
                    }
                    value={device.softwareVersion}
                  />
                </label>
              </CollectBlock>
            </section>

            <section className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8">
              <StepHeader
                n={3}
                subtitle={
                  device.platform === 'macOS'
                    ? legacyMacPrefs
                      ? 'Leave System Preferences. Open the Messages app → Preferences… → iMessage.'
                      : 'Leave System Settings. Open the Messages app → Settings… → iMessage.'
                    : device.platform === 'iPadOS'
                      ? 'Still in Settings: left sidebar → Messages → Send & Receive.'
                      : 'Settings → Apps → Messages → Send & Receive.'
                }
                title="Messages & FaceTime"
              />
              <CollectBlock
                description="Note which email or phone number Messages and FaceTime use on this device."
                guide={
                  device.platform === 'iOS' ? (
                    <GuideMessagesSendReceive />
                  ) : device.platform === 'iPadOS' ? (
                    <GuideIpadMessages />
                  ) : legacyMacPrefs ? (
                    <GuideMacLegacyMessages />
                  ) : (
                    <GuideMacMessages />
                  )
                }
                hint={messagesHint(device)}
                title="Messages & FaceTime use"
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
              </CollectBlock>
            </section>
          </>
        )}

        <div className="sticky bottom-0 z-20 -mx-5 border-t border-[#dfe4ee] bg-white/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <button className="secondary-button" onClick={onBack} type="button">
              Back to All Devices
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
  );
}
