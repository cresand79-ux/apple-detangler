import type { ReactNode } from 'react';
import { MUM_EMAIL } from './household';
import type { Panel } from './types';

function RedCross() {
  return (
    <span
      aria-label="Do not use"
      className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-[#d71920] text-3xl font-bold leading-none text-[#d71920]"
    >
      ×
    </span>
  );
}

function RedRing({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="relative inline-flex flex-col items-center gap-1.5">
      <div className="relative rounded-xl ring-[3px] ring-[#d71920] ring-offset-2 ring-offset-[#f2f3f7]">
        {children}
      </div>
      <span className="rounded-full bg-[#d71920] px-2.5 py-0.5 text-[11px] font-bold text-white">
        {label}
      </span>
    </div>
  );
}

function Toggle({ on = false }: { on?: boolean }) {
  return (
    <span
      className={`relative h-5 w-9 shrink-0 rounded-full ${on ? 'bg-[#34c759]' : 'bg-[#d1d1d6]'}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow ${
          on ? 'right-0.5' : 'left-0.5'
        }`}
      />
    </span>
  );
}

function UiRow({
  icon,
  title,
  detail,
  danger = false,
  trailing = '›',
}: {
  icon?: string;
  title: string;
  detail?: string;
  danger?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-white px-3 py-2.5">
      {icon && (
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#e8e8ed] text-[11px] font-bold text-[#3a3a3c]">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <b className={`block text-[13px] font-semibold ${danger ? 'text-[#d71920]' : 'text-[#1c1c1e]'}`}>
          {title}
        </b>
        {detail && <small className="block truncate text-[11px] text-[#8e8e93]">{detail}</small>}
      </span>
      <span className="shrink-0 text-[13px] text-[#c7c7cc]">{trailing}</span>
    </div>
  );
}

function Target({
  panel,
  name,
  children,
}: {
  panel: Panel;
  name: string;
  children: ReactNode;
}) {
  return panel.tapTarget === name ? <RedRing label={name}>{children}</RedRing> : children;
}

function DeviceFrame({ panel, children }: { panel: Panel; children: ReactNode }) {
  const wide = panel.device === 'pad' || panel.device === 'mac';
  return (
    <div className={`mx-auto ${wide ? 'max-w-[320px]' : 'max-w-[260px]'}`}>
      <div
        className={`overflow-hidden border-[3px] border-[#1c2438] bg-[#1c2438] shadow-[0_16px_40px_rgba(28,36,56,.18)] ${
          panel.device === 'mac' ? 'rounded-xl' : 'rounded-[28px]'
        }`}
      >
        <div className="flex justify-center bg-[#1c2438] px-4 pb-1.5 pt-2.5">
          <div className="h-1.5 w-16 rounded-full bg-[#4a556e]" />
        </div>
        <div className="min-h-[340px] bg-[#f2f3f7]">
          <div className="flex items-center justify-between px-4 pb-1 pt-2 text-[11px] font-semibold text-[#1c1c1e]">
            <span>9:41</span>
            <span className="tracking-tight text-[#6b778f]">● ◒ 100%</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function ScreenHeader({ title, back }: { title: string; back?: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-[#d8dce6] bg-white px-3 py-2.5">
      <span className="text-[12px] font-semibold text-[#007aff]">{back ? `‹ ${back}` : ''}</span>
      <b className="text-[13px] font-bold text-[#1c1c1e]">{title}</b>
      <span />
    </div>
  );
}

function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      className="min-h-10 w-full rounded-xl bg-[#007aff] px-4 text-[14px] font-semibold text-white"
      type="button"
    >
      {children}
    </button>
  );
}

function Group({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-xl bg-white divide-y divide-[#e5e5ea]">{children}</div>;
}

function IntroCard({
  panel,
  children,
  footer = 'This is a guide note — not a screen on the device. Use Next below to continue.',
}: {
  panel: Panel;
  children?: ReactNode;
  footer?: string;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[#dfe4ec] bg-[#f8f9fc] p-5 md:p-6">
      <p className="text-[12px] font-bold uppercase tracking-[.08em] text-[#5363b1]">
        {panel.eyebrow}
      </p>
      <p className="mt-2 text-[15px] leading-6 text-[#4d5a78]">{panel.caption}</p>
      {children}
      {panel.warning && (
        <p className="mt-4 rounded-xl border border-[#f0c4c4] bg-[#fff5f5] px-3 py-2 text-[13px] font-bold text-[#a12828]">
          {panel.warning}
        </p>
      )}
      <p className="mt-4 text-[13px] leading-5 text-[#6b778f]">{footer}</p>
    </div>
  );
}

function DoneNote({ panel }: { panel: Panel }) {
  return (
    <IntroCard
      footer="Continue with Next in this guide only — you will not see a matching ‘complete’ screen on the device."
      panel={panel}
    >
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-white px-4 py-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#16845b] text-lg font-bold text-white">
          ✓
        </span>
        <div>
          <p className="text-[14px] font-bold text-[#202d47]">Guide checkpoint</p>
          {panel.appleAccountHint && (
            <p className="font-mono text-[12px] text-[#68758c]">{panel.appleAccountHint}</p>
          )}
        </div>
      </div>
    </IntroCard>
  );
}

function ForbiddenNote({ panel }: { panel: Panel }) {
  return (
    <IntroCard
      footer="This is a guide note — not a screen to open. Use Next when you have read it."
      panel={panel}
    >
      <ul className="mt-4 space-y-2 text-[14px] text-[#24304a]">
        <li className="flex gap-2 rounded-xl bg-white px-3 py-2.5">
          <span className="font-bold text-[#16845b]">✓</span>
          <span>
            <strong>Recovery Contacts</strong> — keep what you just added
          </span>
        </li>
        <li className="flex gap-2 rounded-xl bg-white px-3 py-2.5">
          <span className="font-bold text-[#16845b]">✓</span>
          <span>
            <strong>Legacy Contact</strong> — keep who you just added
          </span>
        </li>
        <li className="flex gap-2 rounded-xl border border-[#f0c4c4] bg-[#fff5f5] px-3 py-2.5">
          <span className="font-bold text-[#c0392b]">✗</span>
          <span>
            <strong>Recovery Key</strong> — different setting; leave it off (Andy can handle any
            access-key paperwork later)
          </span>
        </li>
        <li className="flex gap-2 rounded-xl border border-[#f0c4c4] bg-[#fff5f5] px-3 py-2.5">
          <span className="font-bold text-[#c0392b]">✗</span> Payment & Shipping — do not open
        </li>
        <li className="flex gap-2 rounded-xl border border-[#f0c4c4] bg-[#fff5f5] px-3 py-2.5">
          <span className="font-bold text-[#c0392b]">✗</span> Purchase Sharing — leave off
        </li>
      </ul>
    </IntroCard>
  );
}

function PrepIntro({ panel }: { panel: Panel }) {
  const email = panel.appleAccountHint;
  return (
    <IntroCard panel={panel}>
      <ul className="mt-4 space-y-2.5 text-[14px] text-[#24304a]">
        <li className="flex gap-2 rounded-xl bg-white px-3 py-2.5">
          <span className="font-bold text-[#16845b]">✓</span> Wi‑Fi connected
        </li>
        <li className="flex gap-2 rounded-xl bg-white px-3 py-2.5">
          <span className="font-bold text-[#16845b]">✓</span> Mum’s Apple password to hand
        </li>
        <li className="flex flex-col gap-0.5 rounded-xl bg-white px-3 py-2.5">
          <span className="flex gap-2">
            <span className="font-bold text-[#16845b]">✓</span> Dad’s Apple password to hand
          </span>
          {email && <span className="pl-5 font-mono text-[12px] text-[#68758c]">{email}</span>}
        </li>
        <li className="flex gap-2 rounded-xl bg-white px-3 py-2.5">
          <span className="font-bold text-[#16845b]">✓</span> Only this iPad in hand — other devices aside
        </li>
        <li className="flex gap-2 rounded-xl border border-[#f0c4c4] bg-[#fff5f5] px-3 py-2.5">
          <span className="font-bold text-[#c0392b]">!</span> Never choose Erase when signing out
        </li>
      </ul>
      <p className="mt-4 text-[13px] leading-5 text-[#6b778f]">
        Keep this guide open on Mum’s MacBook or Dad’s iMac (or use the printout) while you tap on
        the iPad. Signing out also signs out of App Store, Messages and FaceTime on this device.
      </p>
    </IntroCard>
  );
}

export function UiStoryScene({ panel }: { panel: Panel }) {
  const email = panel.appleAccountHint;

  if (panel.ui === 'prepChecklist') {
    return <PrepIntro panel={panel} />;
  }
  if (panel.ui === 'success') {
    return <DoneNote panel={panel} />;
  }
  if (panel.ui === 'forbidden' && panel.presentation === 'intro') {
    return <ForbiddenNote panel={panel} />;
  }
  if (panel.presentation === 'intro') {
    return <IntroCard panel={panel} />;
  }

  let screen: ReactNode;

  switch (panel.ui) {
    case 'contactsOpen':
      screen = (
        <div className="px-5 py-6">
          <div className="grid grid-cols-2 gap-4">
            {['Mail', 'Photos', 'Settings'].map((app) => (
              <div className="flex flex-col items-center gap-1.5 opacity-40" key={app}>
                <span className="grid h-14 w-14 place-items-center rounded-[14px] bg-[#c7c7cc] text-lg font-bold text-white">
                  {app[0]}
                </span>
                <span className="text-[11px] font-medium">{app}</span>
              </div>
            ))}
            <Target name="Contacts" panel={panel}>
              <div className="flex flex-col items-center gap-1.5">
                <span className="grid h-14 w-14 place-items-center rounded-[14px] bg-[#7d7aff] text-lg font-bold text-white">
                  ◉
                </span>
                <span className="text-[11px] font-semibold">Contacts</span>
              </div>
            </Target>
          </div>
        </div>
      );
      break;
    case 'contactsLists':
      screen = (
        <div>
          <div className="flex items-center justify-between border-b border-[#d8dce6] bg-white px-3 py-2.5">
            <Target name="Lists" panel={panel}>
              <span className="rounded-lg bg-[#007aff]/10 px-2 py-1 text-[13px] font-bold text-[#007aff]">
                ‹ Lists
              </span>
            </Target>
            <b className="text-[13px] font-bold">Contacts</b>
            <span className="w-10" />
          </div>
          <div className="space-y-1 px-4 py-3 text-[13px] text-[#8e8e93]">
            <p>A</p>
            <p className="rounded-lg bg-white px-3 py-2 text-[#1c1c1e]">Adrienne Cresswell</p>
            <p className="rounded-lg bg-white px-3 py-2 text-[#1c1c1e]">Andy Cresswell</p>
          </div>
        </div>
      );
      break;
    case 'contactsExportHold':
      screen = (
        <div className="space-y-3 px-3 pb-4 pt-2">
          <ScreenHeader title="Lists" />
          <p className="px-1 text-[12px] text-[#6b778f]">Touch and hold a list, then tap Export.</p>
          <Group>
            <Target name="Export" panel={panel}>
              <div className="relative bg-white">
                <UiRow title="All Contacts" detail="iCloud" />
                <div className="absolute inset-x-3 top-full z-10 mt-1 overflow-hidden rounded-xl border border-[#d8dce6] bg-white shadow-lg">
                  <div className="border-b border-[#e5e5ea] px-3 py-2.5 text-[13px] font-semibold text-[#007aff]">
                    Export
                  </div>
                  <div className="px-3 py-2.5 text-[13px] text-[#8e8e93]">Share List…</div>
                </div>
              </div>
            </Target>
            <UiRow title="All iCloud" />
          </Group>
        </div>
      );
      break;
    case 'contactsExportFields':
      screen = (
        <div className="space-y-3 px-3 pb-4">
          <ScreenHeader back="Cancel" title="Export" />
          <p className="px-1 text-[12px] text-[#6b778f]">Choose which fields to include.</p>
          <Group>
            <UiRow title="Phone" trailing="✓" />
            <UiRow title="Email" trailing="✓" />
            <UiRow title="Address" trailing="✓" />
            <UiRow title="Notes" trailing="" />
          </Group>
          <Target name="Done" panel={panel}>
            <PrimaryButton>Done</PrimaryButton>
          </Target>
        </div>
      );
      break;
    case 'contactsExportShare':
      screen =
        panel.tapTarget === 'Add All Contacts' ? (
          <div className="px-4 pb-4">
            <ScreenHeader back="Mail" title="All Contacts.vcf" />
            <div className="my-6 rounded-xl bg-white px-4 py-5 text-center">
              <b className="block text-[15px]">Contacts vCard</b>
              <span className="text-[12px] text-[#8e8e93]">Attachment from earlier export</span>
            </div>
            <Target name="Add All Contacts" panel={panel}>
              <PrimaryButton>Add All Contacts</PrimaryButton>
            </Target>
          </div>
        ) : (
          <div>
            <ScreenHeader back="Cancel" title="New Message" />
            <div className="space-y-2 border-b border-[#d8dce6] bg-white px-4 py-3 text-[13px]">
              <p>
                <b>To:</b> Andy, Mum, Dad
              </p>
              <p>
                <b>Subject:</b> Contacts backup
              </p>
            </div>
            <div className="m-4 rounded-xl border border-[#d8dce6] bg-white px-3 py-3 text-[13px] font-semibold">
              All Contacts.vcf <small className="font-normal text-[#8e8e93]">vCard</small>
            </div>
            <div className="flex justify-end px-4">
              <Target name="Send" panel={panel}>
                <button
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#007aff] text-lg font-bold text-white"
                  type="button"
                >
                  ↑
                </button>
              </Target>
            </div>
          </div>
        );
      break;
    case 'home':
      screen = (
        <div className="px-5 py-6">
          <div className="grid grid-cols-2 gap-4">
            {['Mail', 'Contacts', 'Photos'].map((app) => (
              <div className="flex flex-col items-center gap-1.5 opacity-40" key={app}>
                <span className="grid h-14 w-14 place-items-center rounded-[14px] bg-[#c7c7cc] text-lg font-bold text-white">
                  {app[0]}
                </span>
                <span className="text-[11px] font-medium">{app}</span>
              </div>
            ))}
            <Target name={panel.tapTarget ?? 'Settings'} panel={panel}>
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`grid h-14 w-14 place-items-center rounded-[14px] text-lg font-bold text-white ${
                    panel.tapTarget === 'Passwords' ? 'bg-[#1c1c1e]' : 'bg-[#636366]'
                  }`}
                >
                  {panel.tapTarget === 'Passwords' ? '•••' : '⚙'}
                </span>
                <span className="text-[11px] font-semibold">{panel.tapTarget}</span>
              </div>
            </Target>
          </div>
        </div>
      );
      break;
    case 'settingsRoot':
      screen = (
        <div className="space-y-3 px-3 pb-4 pt-2">
          <h2 className="px-1 text-[22px] font-bold tracking-tight">Settings</h2>
          <Group>
            <Target name="Adrienne Cresswell" panel={panel}>
              <UiRow detail={email} icon="A" title="Adrienne Cresswell" />
            </Target>
          </Group>
          <Group>
            <UiRow icon="◉" title="General" />
            <UiRow icon="◐" title="Accessibility" />
            <UiRow icon="▣" title="Apps" />
          </Group>
        </div>
      );
      break;
    case 'appleAccount':
      screen = (
        <div>
          <ScreenHeader back="Settings" title="Apple Account" />
          <div className="flex flex-col items-center gap-1 px-4 py-5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#c7c7cc] text-lg font-bold text-white">
              AC
            </div>
            <b className="text-[15px]">Adrienne Cresswell</b>
            <small className="text-[12px] text-[#8e8e93]">{email}</small>
          </div>
          <div className="space-y-3 px-3 pb-4">
            <Group>
              <UiRow title="Sign-In & Security" />
              <UiRow title="Payment & Shipping" />
              <UiRow title="Media & Purchases" />
            </Group>
            <Group>
              <Target name="Sign Out" panel={panel}>
                <UiRow danger title="Sign Out" trailing="" />
              </Target>
            </Group>
          </div>
        </div>
      );
      break;
    case 'signOutChoice':
      screen = (
        <div className="flex min-h-[300px] items-end bg-[#1c1c1e]/25 p-3">
          <div className="w-full space-y-2 rounded-2xl bg-[#f2f3f7] p-4 text-center">
            <h3 className="text-[15px] font-bold">How do you want to sign out?</h3>
            <p className="text-[12px] text-[#6b778f]">Keep using this device after signing out.</p>
            <Target name="Sign Out But Don’t Erase" panel={panel}>
              <button
                className="min-h-11 w-full rounded-xl bg-white text-[14px] font-semibold text-[#007aff]"
                type="button"
              >
                Sign Out But Don’t Erase
              </button>
            </Target>
            <button
              className="min-h-11 w-full rounded-xl bg-white text-[14px] font-semibold text-[#d71920] line-through opacity-50"
              type="button"
            >
              Erase this Device
            </button>
            <button className="min-h-10 w-full rounded-xl bg-white text-[14px] font-semibold" type="button">
              Cancel
            </button>
          </div>
        </div>
      );
      break;
    case 'signOutConfirm':
      screen = (
        <div className="flex min-h-[300px] items-end bg-[#1c1c1e]/25 p-3">
          <div className="w-full rounded-2xl bg-[#f2f3f7] p-4 text-center">
            <h3 className="text-[16px] font-bold">Confirm and Sign Out</h3>
            <p className="mt-1 text-[12px] text-[#6b778f]">
              You are leaving Mum’s Apple Account on this device only.
            </p>
            <div className="mt-4 space-y-2">
              <Target name="Confirm and Sign Out" panel={panel}>
                <button
                  className="min-h-10 w-full rounded-xl bg-white text-[14px] font-semibold text-[#d71920]"
                  type="button"
                >
                  Confirm and Sign Out
                </button>
              </Target>
              <button className="min-h-10 w-full rounded-xl bg-white text-[14px] font-semibold" type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
      break;
    case 'icloudContacts':
      screen = (
        <div className="space-y-3 px-3 pb-4">
          <ScreenHeader back="Apple Account" title="iCloud" />
          <p className="px-1 text-[12px] text-[#6b778f]">Saved to iCloud</p>
          <Group>
            <Target name="Contacts" panel={panel}>
              <UiRow title="Contacts" trailing={<Toggle on />} />
            </Target>
            <UiRow title="Calendars" trailing={<Toggle />} />
            <UiRow title="Passwords" trailing={<Toggle on />} />
          </Group>
        </div>
      );
      break;
    case 'keepCopy':
      screen = (
        <div>
          <ScreenHeader title="Keep a Copy?" />
          <p className="px-4 py-3 text-[12px] text-[#6b778f]">Choose data to keep on this device.</p>
          <div className="space-y-3 px-3 pb-4">
            <Group>
              <Target name="Contacts" panel={panel}>
                <UiRow title="Contacts" trailing={<Toggle on />} />
              </Target>
              <UiRow title="Safari" trailing={<Toggle />} />
              <UiRow title="Keychain" trailing={<Toggle />} />
            </Group>
            <PrimaryButton>Sign Out</PrimaryButton>
          </div>
        </div>
      );
      break;
    case 'passcode':
      screen = (
        <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
          <div className="text-2xl text-[#8e8e93]">●</div>
          <h3 className="text-[16px] font-bold">Enter Device Passcode</h3>
          <div className="tracking-[0.35em] text-[#1c1c1e]">● ● ● ● ● ●</div>
          <p className="text-[12px] text-[#6b778f]">Enter the code privately.</p>
          <Target name="Continue" panel={panel}>
            <PrimaryButton>Continue</PrimaryButton>
          </Target>
        </div>
      );
      break;
    case 'signIn':
      screen = (
        <div className="flex flex-col items-center gap-3 px-5 py-8 text-center">
          <div className="text-2xl"></div>
          <h3 className="text-[16px] font-bold">Sign in to Apple Account</h3>
          <label className="w-full rounded-xl bg-white px-3 py-2.5 text-left text-[11px] font-semibold text-[#8e8e93]">
            Email or Phone Number
            <span className="mt-0.5 block font-mono text-[12px] font-medium text-[#1c1c1e]">{email}</span>
          </label>
          <label className="w-full rounded-xl bg-white px-3 py-2.5 text-left text-[11px] font-semibold text-[#8e8e93]">
            Password
            <span className="mt-0.5 block text-[12px] font-medium text-[#1c1c1e]">••••••••••</span>
          </label>
          <Target name="Continue" panel={panel}>
            <PrimaryButton>Continue</PrimaryButton>
          </Target>
        </div>
      );
      break;
    case '2fa':
      screen = (
        <div className="flex min-h-[300px] items-end bg-[#1c1c1e]/25 p-3">
          <div className="w-full rounded-2xl bg-[#f2f3f7] p-4 text-center">
            <div className="mx-auto mb-2 h-3 w-3 rounded-full bg-[#34c759]" />
            <h3 className="text-[15px] font-bold">Apple Account Sign-In Requested</h3>
            <p className="mt-1 text-[12px] text-[#6b778f]">A device is signing in nearby.</p>
            <div className="mt-4 space-y-2">
              <Target name="Allow" panel={panel}>
                <PrimaryButton>Allow</PrimaryButton>
              </Target>
              <button className="min-h-10 w-full rounded-xl bg-white text-[14px] font-semibold" type="button">
                Don’t Allow
              </button>
            </div>
          </div>
        </div>
      );
      break;
    case 'mediaPurchases':
      screen = (
        <div>
          <ScreenHeader back="Settings" title="Apple Account" />
          <div className="flex flex-col items-center gap-1 px-4 py-5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#c7c7cc] text-lg font-bold text-white">
              PC
            </div>
            <b className="text-[15px]">Peter Cresswell</b>
            <small className="text-[12px] text-[#8e8e93]">{email}</small>
          </div>
          <div className="space-y-3 px-3 pb-4">
            <Group>
              <Target name="Media & Purchases" panel={panel}>
                <UiRow detail={email} icon="▶" title="Media & Purchases" />
              </Target>
            {(panel.tapTarget === 'Switch account' || panel.tapTarget === 'Not Adrienne?') && (
              <Target name={panel.tapTarget} panel={panel}>
                <UiRow title={panel.tapTarget === 'Not Adrienne?' ? 'Not Adrienne?' : 'Switch account'} />
              </Target>
            )}
            </Group>
          </div>
        </div>
      );
      break;
    case 'messages': {
      const phoneHint = panel.messagesPhoneHint ?? 'Owner’s mobile number';
      const emailHint = panel.messagesEmailHint ?? email ?? 'Owner’s email';
      screen = (
        <div>
          <ScreenHeader back="Apps" title="Messages" />
          <div className="space-y-3 px-3 py-4">
            <Group>
              <UiRow title="iMessage" trailing={<Toggle on />} />
              <Target name="Send & Receive" panel={panel}>
                <UiRow detail="You Can Be Reached By" title="Send & Receive" />
              </Target>
            </Group>
            <div className="rounded-xl bg-white px-3 py-3 text-[12px] leading-5 text-[#3a3a3c]">
              <p className="mb-2 font-bold text-[#1c1c1e]">Tick only the owner’s details</p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-[#16845b]">✓</span>
                <span>{phoneHint}</span>
              </p>
              <p className="mt-1.5 flex items-start gap-2">
                <span className="font-bold text-[#16845b]">✓</span>
                <span className="font-mono text-[11px]">{emailHint}</span>
              </p>
              <p className="mt-2 flex items-start gap-2 text-[#a12828]">
                <span className="font-bold">✗</span>
                <span>
                  Untick Mum’s email if listed:{' '}
                  <span className="font-mono text-[11px]">{MUM_EMAIL}</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      );
      break;
    }
    case 'passwordsHome':
      screen = (
        <div className="space-y-3 px-3 pb-4 pt-2">
          <ScreenHeader title="Passwords" />
          <h2 className="px-1 text-[18px] font-bold">Groups</h2>
          <Group>
            <UiRow detail="132 passwords" icon="●" title="All" />
            <UiRow detail="18 passwords" icon="◆" title="Family" />
          </Group>
          <Target name="New Group" panel={panel}>
            <button
              className="min-h-10 w-full rounded-xl border border-dashed border-[#007aff] bg-white text-[14px] font-semibold text-[#007aff]"
              type="button"
            >
              ＋ New Group
            </button>
          </Target>
        </div>
      );
      break;
    case 'newSharedGroup':
      screen = (
        <div className="space-y-4 px-3 pb-4">
          <ScreenHeader back="Cancel" title="New Shared Group" />
          <label className="block rounded-xl bg-white px-3 py-2.5 text-[11px] font-semibold text-[#8e8e93]">
            Group Name
            <span className="mt-0.5 block text-[14px] font-semibold text-[#1c1c1e]">
              Cresswell Household
            </span>
          </label>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#3446a5] text-sm font-bold text-white">
            CH
          </div>
          <Target name="Add People" panel={panel}>
            <PrimaryButton>Add People</PrimaryButton>
          </Target>
        </div>
      );
      break;
    case 'addPeople':
      screen = (
        <div className="space-y-3 px-3 pb-4">
          <ScreenHeader title="Cresswell Household" />
          <Group>
            <UiRow
              detail="peter_cresswell@myself.com"
              icon="P"
              title="Peter Cresswell"
              trailing="✓"
            />
            <UiRow icon="A" title="Andy" trailing="✓" />
            <UiRow icon="S" title="Simon" trailing="✓" />
          </Group>
          <Target name={panel.tapTarget ?? 'Create'} panel={panel}>
            <PrimaryButton>{panel.tapTarget}</PrimaryButton>
          </Target>
        </div>
      );
      break;
    case 'movePasswords':
      screen = (
        <div className="space-y-3 px-3 pb-4">
          <ScreenHeader back="Cancel" title="Select Passwords" />
          <Group>
            <UiRow title="Broadband" trailing="✓" />
            <UiRow title="Utilities" trailing="✓" />
            <UiRow title="Household services" trailing="✓" />
          </Group>
          <Target name="Move" panel={panel}>
            <PrimaryButton>Move to Cresswell Household</PrimaryButton>
          </Target>
        </div>
      );
      break;
    case 'groupInvite':
      screen = (
        <div className="flex min-h-[300px] items-end bg-[#1c1c1e]/25 p-3">
          <div className="w-full rounded-2xl bg-[#f2f3f7] p-4 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#3446a5] text-sm font-bold text-white">
              CH
            </div>
            <h3 className="text-[15px] font-bold">Shared Password Group</h3>
            <p className="mt-1 text-[12px] text-[#6b778f]">
              Adrienne invited you to “Cresswell Household”.
            </p>
            <div className="mt-4 space-y-2">
              <Target name="Accept" panel={panel}>
                <PrimaryButton>Accept</PrimaryButton>
              </Target>
              <button className="min-h-10 w-full rounded-xl bg-white text-[14px] font-semibold" type="button">
                Not Now
              </button>
            </div>
          </div>
        </div>
      );
      break;
    case 'autofill':
      screen = (
        <div>
          <ScreenHeader back="General" title="AutoFill & Passwords" />
          <div className="px-3 py-4">
            <Group>
              <Target name="AutoFill Passwords" panel={panel}>
                <UiRow title="AutoFill Passwords and Passkeys" trailing={<Toggle on />} />
              </Target>
              <UiRow title="Passwords" trailing="✓" />
            </Group>
          </div>
        </div>
      );
      break;
    case 'signInSecurity':
      screen = (
        <div>
          <ScreenHeader back="Settings" title="Apple Account" />
          <div className="px-3 py-4">
            <Group>
              <Target name="Sign-In & Security" panel={panel}>
                <UiRow
                  detail="Password, recovery, security"
                  icon="●"
                  title="Sign-In & Security"
                />
              </Target>
              <UiRow icon="◉" title="Personal Information" />
            </Group>
          </div>
        </div>
      );
      break;
    case 'recoveryContacts':
      screen = (
        <div className="space-y-3 px-3 pb-4">
          <ScreenHeader back="Account" title="Sign-In & Security" />
          <Group>
            <Target name="Recovery Contacts" panel={panel}>
              <UiRow
                detail="People who can help you recover access"
                title="Recovery Contacts"
              />
            </Target>
          </Group>
          <Group>
            <UiRow icon="A" title="Andy" trailing="✓" />
            <UiRow icon="S" title="Simon" trailing="✓" />
          </Group>
          {panel.tapTarget === 'Add Recovery Contact' && (
            <Target name="Add Recovery Contact" panel={panel}>
              <PrimaryButton>Add Recovery Contact</PrimaryButton>
            </Target>
          )}
        </div>
      );
      break;
    case 'legacyContact':
      screen = (
        <div className="space-y-3 px-3 pb-4">
          <ScreenHeader back="Account" title="Legacy Contact" />
          <p className="px-1 text-[12px] text-[#6b778f]">
            People who can access your account after your death.
          </p>
          <Group>
            <UiRow icon="A" title="Andy" />
            <UiRow icon="S" title="Simon" />
          </Group>
          <Target name="Add Legacy Contact" panel={panel}>
            <PrimaryButton>Add Legacy Contact</PrimaryButton>
          </Target>
        </div>
      );
      break;
    case 'forbidden':
      screen = (
        <div className="flex flex-col items-center gap-4 px-4 py-8">
          <RedCross />
          <div className="w-full">
            <Group>
              {panel.device === 'watch' ? (
                <UiRow danger title="Unpair Apple Watch" trailing="" />
              ) : (
                <>
                  <UiRow danger title="Recovery Key — Leave Off" trailing="" />
                  <UiRow danger title="Payment & Shipping" trailing="" />
                  <UiRow danger title="Purchase Sharing" trailing="" />
                </>
              )}
            </Group>
          </div>
        </div>
      );
      break;
    case 'later':
      screen = (
        <div className="flex flex-col items-center gap-3 px-5 py-8 text-center">
          <div className="rounded-2xl border border-[#d8dce6] bg-white px-6 py-5">
            <b className="block text-[18px] tracking-wide text-[#3446a5]">LATER</b>
            <span className="text-[11px] font-semibold uppercase text-[#8e8e93]">Wait</span>
          </div>
          <h3 className="text-[14px] font-bold text-[#1c1c1e]">{panel.osLabel}</h3>
          <p className="text-[13px] text-[#6b778f]">{panel.caption}</p>
          <Target name={panel.tapTarget ?? 'Later'} panel={panel}>
            <PrimaryButton>{panel.tapTarget}</PrimaryButton>
          </Target>
        </div>
      );
      break;
  }

  return (
    <div>
      <DeviceFrame panel={panel}>{screen}</DeviceFrame>
      {panel.path && (
        <p className="mt-3 text-center text-[12px] font-medium text-[#6b778f]">
          <span className="font-bold text-[#3a4660]">Path · </span>
          {panel.path}
        </p>
      )}
    </div>
  );
}
