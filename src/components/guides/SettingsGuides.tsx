import type { ReactNode } from 'react';

type GuideProps = { className?: string };

function PhoneChrome({
  title,
  children,
  className = '',
  caption,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  caption?: string;
}) {
  const frame = (
    <div
      className={`mx-auto w-full max-w-[280px] overflow-hidden rounded-[28px] border-[3px] border-[#1c2438] bg-[#f2f3f7] shadow-[0_16px_40px_rgba(28,36,56,.18)] ${className}`}
    >
      <div className="flex items-center justify-center bg-[#1c2438] px-4 pb-2 pt-3">
        <div className="h-1.5 w-16 rounded-full bg-[#4a556e]" />
      </div>
      <div className="border-b border-[#d8dce6] bg-white px-4 py-3 text-center text-[13px] font-bold text-[#1c2438]">
        {title}
      </div>
      <div className="space-y-1.5 bg-[#f2f3f7] p-3">{children}</div>
    </div>
  );

  if (!caption) return frame;

  return (
    <figure className={`mx-auto w-full max-w-[280px] ${className}`}>
      {frame}
      <figcaption className="mt-2 px-1 text-center text-[11px] font-semibold leading-4 text-[#8b5060]">
        {caption}
      </figcaption>
    </figure>
  );
}

function Row({
  label,
  hint,
  highlight,
  chevron = true,
  value,
  toggleOn,
}: {
  label: string;
  hint?: string;
  highlight?: boolean;
  chevron?: boolean;
  value?: string;
  toggleOn?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 ${
        highlight ? 'ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#f2f3f7]' : ''
      }`}
    >
      {highlight && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1 -top-1 h-5 w-5 rounded-full border-[3px] border-[#e11d2e] bg-[#e11d2e]/15"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-[#1f2a44]">{label}</div>
        {hint && <div className="truncate text-[11px] text-[#6b778f]">{hint}</div>}
      </div>
      {typeof toggleOn === 'boolean' ? (
        <span
          className={`relative h-5 w-9 shrink-0 rounded-full ${toggleOn ? 'bg-[#34c759]' : 'bg-[#d1d1d6]'}`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow ${
              toggleOn ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </span>
      ) : (
        <>
          {(value ?? null) !== null && (
            <span className="shrink-0 text-[12px] text-[#6b778f]">{value}</span>
          )}
          {chevron && <span className="text-[#9aa3b5]">›</span>}
        </>
      )}
    </div>
  );
}

function ProfileCard({
  subtitle,
  highlight,
}: {
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center gap-3 rounded-xl bg-white px-3 py-3 ${
        highlight ? 'ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#f2f3f7]' : ''
      }`}
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#c7c7cc] text-sm font-bold text-white">
        Y
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-bold text-[#1f2a44]">Your Name</div>
        <div className="truncate text-[11px] text-[#6b778f]">{subtitle}</div>
      </div>
      <span className="text-[#9aa3b5]">›</span>
    </div>
  );
}

/* ─── Modern iPhone (iOS) ───────────────────────────────────────────── */

/** Settings → tap name card (“Apple Account, iCloud and more”) */
export function GuideNameAtTop({ className }: GuideProps) {
  return (
    <PhoneChrome
      caption="Settings → tap your name (Apple Account, iCloud and more)."
      className={className}
      title="Settings"
    >
      <ProfileCard highlight subtitle="Apple Account, iCloud and more" />
      <Row label="Airplane Mode" chevron={false} />
      <Row hint="Network" label="Wi-Fi" />
      <Row hint="On" label="Bluetooth" />
      <Row label="General" />
    </PhoneChrome>
  );
}

/** Settings → General → About → Name / iOS Version */
export function GuideGeneralAbout({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <PhoneChrome caption="Settings → General → About." title="General">
        <Row highlight label="About" />
        <Row label="Software Update" />
        <Row label="AirDrop" />
        <Row label="iPhone Storage" />
      </PhoneChrome>
      <PhoneChrome caption="On About: copy Name and iOS Version." title="About">
        <Row highlight label="Name" value="This iPhone" />
        <Row highlight label="iOS Version" value="17.0.1" />
        <Row label="Model Name" value="iPhone" />
      </PhoneChrome>
    </div>
  );
}

/** Apple Account → Media & Purchases → Account Settings → Apple Account */
export function GuideMediaPurchases({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <PhoneChrome
        caption="Apple Account → Media & Purchases."
        className={className}
        title="Apple Account"
      >
        <div className="rounded-xl bg-white px-3 py-3 text-center">
          <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-[#c7c7cc]" />
          <div className="text-[13px] font-bold text-[#1f2a44]">Your Name</div>
          <div className="text-[11px] text-[#6b778f]">name@example.com</div>
        </div>
        <Row label="Personal Information" />
        <Row label="Sign-In & Security" />
        <Row label="iCloud" value="5 GB" />
        <Row highlight label="Media & Purchases" />
        <Row label="Sign in with Apple" />
      </PhoneChrome>
      <PhoneChrome
        caption="Account Settings → Apple Account (purchase email)."
        title="Account Settings"
      >
        <Row highlight hint="name@example.com" label="Apple Account" />
      </PhoneChrome>
    </div>
  );
}

/** Settings → Apps → Messages → Send & Receive */
export function GuideMessagesSendReceive({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <PhoneChrome caption="Settings → Apps." className={className} title="Settings">
        <Row label="Game Center" />
        <Row label="iCloud" />
        <Row label="Wallet & Apple Pay" />
        <Row highlight label="Apps" />
      </PhoneChrome>
      <PhoneChrome caption="Apps → Messages → Send & Receive." title="Messages">
        <Row chevron={false} hint="On" label="iMessage" />
        <Row highlight hint="Addresses & phone numbers" label="Send & Receive" />
        <Row label="Share Name and Photo" />
      </PhoneChrome>
    </div>
  );
}

/** Apple Account → iCloud → Saved to iCloud → See All → Contacts */
export function GuideContactsIcloud({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <PhoneChrome
        caption="Apple Account → iCloud → Saved to iCloud → See All."
        className={className}
        title="iCloud"
      >
        <p className="flex items-center justify-between px-1 text-[11px] font-bold text-[#1f2a44]">
          <span>Saved to iCloud</span>
          <span className="text-[#3478f6]">See All ›</span>
        </p>
        <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-white p-2">
          {['Photos', 'Drive', 'Passwords', 'Notes', 'Messages', 'Mail'].map((label) => (
            <div
              key={label}
              className="rounded-lg bg-[#f2f3f7] px-1 py-2 text-center text-[10px] font-semibold text-[#1f2a44]"
            >
              {label}
            </div>
          ))}
        </div>
        <Row highlight label="See All" />
      </PhoneChrome>
      <PhoneChrome caption="Find Contacts and note whether the switch is on." title="Saved to iCloud">
        <Row label="Messages in iCloud" value="On" />
        <Row label="iCloud Calendar" value="On" />
        <Row highlight label="Contacts" toggleOn />
        <Row label="Reminders" toggleOn={false} />
      </PhoneChrome>
    </div>
  );
}

/** Apple Account → scroll to Devices list at the bottom */
export function GuideDevicesOnAccount({ className }: GuideProps) {
  return (
    <PhoneChrome
      caption="Still on Apple Account: scroll down past Media & Purchases to the Devices list."
      className={className}
      title="Apple Account"
    >
      <div className="rounded-xl bg-white px-3 py-2 text-center opacity-60">
        <div className="text-[12px] font-bold text-[#1f2a44]">Your Name</div>
        <div className="text-[10px] text-[#6b778f]">name@example.com</div>
      </div>
      <Row label="iCloud" value="5 GB" />
      <Row label="Media & Purchases" />
      <p className="px-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
        Devices
      </p>
      <div className="space-y-1 rounded-xl bg-white p-1 ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#f2f3f7]">
        <Row chevron={false} hint="This iPhone" label="iPhone" />
        <Row chevron={false} hint="MacBook Air" label="MacBook Air" />
        <Row chevron={false} hint="iPad" label="iPad" />
      </div>
      <p className="px-1 pt-1 text-[10px] leading-4 text-[#6b778f]">
        Compare this list with the household cards below.
      </p>
    </PhoneChrome>
  );
}

/* ─── Modern Mac (System Settings) ──────────────────────────────────── */

function MacSettingsChrome({
  sidebar,
  detailTitle,
  detail,
  caption,
  className = '',
}: {
  sidebar: ReactNode;
  detailTitle: string;
  detail: ReactNode;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={`mx-auto w-full max-w-[560px] ${className}`}>
      <div className="overflow-hidden rounded-[12px] border border-[#c6c6c8] bg-[#ececec] shadow-[0_16px_40px_rgba(28,36,56,.14)]">
        <div className="flex items-center gap-2 border-b border-[#d8d8da] bg-[#f6f6f6] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[11px] font-semibold text-[#6b778f]">System Settings</span>
        </div>
        <div className="grid min-h-[230px] grid-cols-[38%_62%]">
          <div className="space-y-1 border-r border-[#d8d8da] bg-[#e8e8ed] p-2.5">{sidebar}</div>
          <div className="bg-[#f5f5f7]">
            <div className="border-b border-[#e0e0e4] px-3 py-2.5 text-[13px] font-bold text-[#1c2438]">
              {detailTitle}
            </div>
            <div className="space-y-1.5 p-2.5">{detail}</div>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 px-1 text-center text-[11px] font-semibold leading-4 text-[#8b5060]">
        {caption}
      </figcaption>
    </figure>
  );
}

function MacSidebarRow({
  label,
  hint,
  selected,
  highlight,
}: {
  label: string;
  hint?: string;
  selected?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-md px-2.5 py-1.5 ${
        selected ? 'bg-[#0a7aff] text-white' : 'text-[#1f2a44]'
      } ${highlight ? 'ring-2 ring-[#e11d2e] ring-offset-1 ring-offset-[#e8e8ed]' : ''}`}
    >
      <div className="truncate text-[12px] font-semibold">{label}</div>
      {hint && (
        <div className={`truncate text-[10px] ${selected ? 'text-white/80' : 'text-[#6b778f]'}`}>
          {hint}
        </div>
      )}
    </div>
  );
}

function MacDetailRow({
  label,
  value,
  highlight,
  chevron = true,
  button,
  toggleOn,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
  chevron?: boolean;
  button?: string;
  toggleOn?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 ${
        highlight ? 'ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#f5f5f7]' : ''
      }`}
    >
      <div className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#1f2a44]">{label}</div>
      {typeof toggleOn === 'boolean' ? (
        <span
          className={`relative h-5 w-9 shrink-0 rounded-full ${toggleOn ? 'bg-[#34c759]' : 'bg-[#d1d1d6]'}`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow ${
              toggleOn ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </span>
      ) : (
        <>
          {value && <span className="shrink-0 text-[11px] text-[#6b778f]">{value}</span>}
          {button && (
            <span className="shrink-0 rounded-md bg-[#e8e8ed] px-2 py-1 text-[11px] font-semibold text-[#1f2a44]">
              {button}
            </span>
          )}
          {chevron && !button && <span className="text-[#9aa3b5]">›</span>}
        </>
      )}
    </div>
  );
}

function MacWindow({
  title,
  children,
  caption,
  className = '',
  narrow = false,
}: {
  title: string;
  children: ReactNode;
  caption: string;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <figure className={`mx-auto w-full ${narrow ? 'max-w-[280px]' : 'max-w-[420px]'} ${className}`}>
      <div className="overflow-hidden rounded-[12px] border border-[#c6c6c8] bg-[#f5f5f7] shadow-[0_16px_40px_rgba(28,36,56,.14)]">
        <div className="flex items-center gap-2 border-b border-[#d8d8da] bg-[#f6f6f6] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[11px] font-semibold text-[#1c2438]">{title}</span>
        </div>
        <div className="space-y-1.5 p-3">{children}</div>
      </div>
      <figcaption className="mt-2 px-1 text-center text-[11px] font-semibold leading-4 text-[#8b5060]">
        {caption}
      </figcaption>
    </figure>
  );
}

/** System Settings → Apple Account (sidebar name) */
export function GuideMacAppleAccount({ className }: GuideProps) {
  return (
    <MacSettingsChrome
      caption="System Settings → click your name (Apple Account)."
      className={className}
      detailTitle="Apple Account"
      detail={
        <>
          <div className="rounded-lg bg-white px-3 py-3 text-center">
            <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-[#c7c7cc]" />
            <div className="text-[14px] font-bold text-[#1f2a44]">Your Name</div>
            <div className="text-[11px] text-[#6b778f]">name@example.com</div>
          </div>
          <MacDetailRow label="Personal Information" />
          <MacDetailRow label="Sign-In & Security" />
          <MacDetailRow label="iCloud" value="5 GB" />
          <MacDetailRow label="Family" value="Set Up" />
        </>
      }
      sidebar={
        <>
          <MacSidebarRow highlight hint="Apple Account" label="Your Name" selected />
          <MacSidebarRow label="Wi-Fi" />
          <MacSidebarRow label="Bluetooth" />
          <MacSidebarRow label="Network" />
          <MacSidebarRow label="General" />
        </>
      }
    />
  );
}

/** System Settings → General → About / Apple menu → About This Mac */
export function GuideMacAbout({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <MacSettingsChrome
        caption="System Settings → General → About."
        className={className}
        detailTitle="General"
        detail={
          <>
            <MacDetailRow highlight label="About" />
            <MacDetailRow label="Software Update" />
            <MacDetailRow label="Storage" />
            <MacDetailRow label="AirDrop & Continuity" />
          </>
        }
        sidebar={
          <>
            <MacSidebarRow hint="Apple Account" label="Your Name" />
            <MacSidebarRow label="Wi-Fi" />
            <MacSidebarRow highlight label="General" selected />
            <MacSidebarRow label="Accessibility" />
          </>
        }
      />
      <MacSettingsChrome
        caption="On About: copy Name and the macOS version."
        detailTitle="About"
        detail={
          <>
            <MacDetailRow highlight label="Name" value="This Mac" />
            <MacDetailRow label="Chip" value="Apple silicon" />
            <MacDetailRow highlight label="macOS" value="Version 15.x" />
          </>
        }
        sidebar={
          <>
            <MacSidebarRow hint="Apple Account" label="Your Name" />
            <MacSidebarRow highlight label="General" selected />
          </>
        }
      />
      <MacWindow caption="Or  → About This Mac for the macOS version." narrow title="About This Mac">
        <div className="rounded-lg bg-white px-3 py-4 text-center">
          <div className="text-[15px] font-bold text-[#1f2a44]">MacBook Pro</div>
          <div className="mt-1 text-[12px] text-[#6b778f]">macOS · Version 15.x</div>
        </div>
        <MacDetailRow chevron={false} label="Chip" value="Apple silicon" />
        <MacDetailRow chevron={false} label="Memory" value="—" />
        <div className="flex justify-center pt-1">
          <span className="rounded-md bg-[#e8e8ed] px-3 py-1.5 text-[11px] font-semibold text-[#1f2a44]">
            More Info…
          </span>
        </div>
      </MacWindow>
    </div>
  );
}

/** System Settings → Apple Account → Media & Purchases → Account → Manage… */
export function GuideMacMediaPurchases({ className }: GuideProps) {
  return (
    <MacSettingsChrome
      caption="Apple Account → Media & Purchases → Account → Manage…"
      className={className}
      detailTitle="Media & Purchases"
      detail={
        <>
          <p className="px-1 text-[11px] text-[#6b778f]">App Store, Books, News, Music and TV</p>
          <MacDetailRow
            button="Manage…"
            chevron={false}
            highlight
            label="Account"
            value="Your Name"
          />
        </>
      }
      sidebar={
        <>
          <MacSidebarRow hint="Apple Account" label="Your Name" selected />
          <MacSidebarRow label="General" />
        </>
      }
    />
  );
}

/** Messages app → Messages → Settings… → iMessage */
export function GuideMacMessages({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <MacWindow
        caption="Open Messages → Messages menu → Settings…"
        className={className}
        narrow
        title="Messages"
      >
        <div className="rounded-lg border border-[#d8d8da] bg-white py-1">
          <div className="px-3 py-1.5 text-[12px] text-[#1f2a44]">About Messages</div>
          <div className="mx-1 rounded-md bg-[#0a7aff] px-2.5 py-1.5 text-[12px] font-semibold text-white ring-2 ring-[#e11d2e] ring-offset-1">
            Settings…
          </div>
          <div className="px-3 py-1.5 text-[12px] text-[#1f2a44]">Services</div>
          <div className="px-3 py-1.5 text-[12px] text-[#1f2a44]">Quit Messages</div>
        </div>
      </MacWindow>
      <MacWindow caption="iMessage tab → You can be reached for messages at…" title="iMessage">
        <div className="mb-2 flex gap-2 text-[11px] font-semibold">
          <span className="rounded-md px-2 py-1 text-[#6b778f]">General</span>
          <span className="rounded-md bg-white px-2 py-1 text-[#0a7aff] ring-1 ring-[#0a7aff]/30">
            iMessage
          </span>
          <span className="rounded-md px-2 py-1 text-[#6b778f]">Shared with You</span>
        </div>
        <MacDetailRow chevron={false} label="Apple Account" value="name@example.com" />
        <p className="px-1 pt-1 text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
          You can be reached for messages at
        </p>
        <MacDetailRow chevron={false} highlight label="Phone number" value="☑" />
        <MacDetailRow chevron={false} highlight label="name@example.com" value="☑" />
        <MacDetailRow chevron={false} label="Start new conversations from" value="…" />
      </MacWindow>
    </div>
  );
}

/** Apple Account → iCloud → Saved to iCloud → See All → Contacts */
export function GuideMacContactsIcloud({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <MacSettingsChrome
        caption="Apple Account → iCloud → Saved to iCloud → See All."
        className={className}
        detailTitle="iCloud"
        detail={
          <>
            <p className="flex items-center justify-between px-1 text-[12px] font-bold text-[#1f2a44]">
              <span>Saved to iCloud</span>
              <span className="text-[#0a7aff]">See All ›</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-white p-2">
              {['Photos', 'Drive', 'Passwords', 'Notes', 'Messages', 'Mail'].map((label) => (
                <div
                  key={label}
                  className="rounded-md bg-[#f5f5f7] px-1 py-2 text-center text-[10px] font-semibold text-[#1f2a44]"
                >
                  {label}
                </div>
              ))}
            </div>
            <MacDetailRow highlight label="See All" />
          </>
        }
        sidebar={
          <>
            <MacSidebarRow hint="Apple Account" label="Your Name" selected />
            <MacSidebarRow label="General" />
          </>
        }
      />
      <MacSettingsChrome
        caption="Find Contacts and note whether the switch is on."
        detailTitle="Saved to iCloud"
        detail={
          <>
            <MacDetailRow label="Messages in iCloud" value="On" />
            <MacDetailRow label="Find My Mac" value="On" />
            <MacDetailRow highlight label="Contacts" toggleOn />
            <MacDetailRow label="Reminders" toggleOn={false} />
          </>
        }
        sidebar={
          <>
            <MacSidebarRow hint="Apple Account" label="Your Name" selected />
            <MacSidebarRow label="General" />
          </>
        }
      />
    </div>
  );
}

/** System Settings → Apple Account → Devices */
export function GuideMacDevicesOnAccount({ className }: GuideProps) {
  return (
    <MacSettingsChrome
      caption="Apple Account → scroll to Devices. Tick matching household cards below."
      className={className}
      detailTitle="Apple Account"
      detail={
        <>
          <div className="rounded-lg bg-white px-3 py-2 text-center opacity-60">
            <div className="text-[13px] font-bold text-[#1f2a44]">Your Name</div>
            <div className="text-[11px] text-[#6b778f]">name@example.com</div>
          </div>
          <MacDetailRow label="iCloud" value="5 GB" />
          <MacDetailRow label="Media & Purchases" />
          <p className="px-1 pt-1 text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
            Devices
          </p>
          <div className="space-y-1 rounded-lg bg-white p-1 ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#f5f5f7]">
            <MacDetailRow chevron={false} label="MacBook Air" value="This Mac" />
            <MacDetailRow chevron={false} label="iPhone" />
            <MacDetailRow chevron={false} label="iPad" />
          </div>
        </>
      }
      sidebar={
        <>
          <MacSidebarRow hint="Apple Account" label="Your Name" selected />
          <MacSidebarRow label="General" />
        </>
      }
    />
  );
}

/* ─── Legacy Mac (Monterey / Big Sur System Preferences) ────────────── */

function MacSysPrefsChrome({
  title,
  children,
  caption,
  className = '',
}: {
  title: string;
  children: ReactNode;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={`mx-auto w-full max-w-[520px] ${className}`}>
      <div className="overflow-hidden rounded-[10px] border border-[#b8b8bd] bg-[#ececec] shadow-[0_16px_40px_rgba(28,36,56,.14)]">
        <div className="flex items-center gap-2 border-b border-[#d0d0d4] bg-[#f4f4f6] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded border border-[#c8c8cc] bg-white text-[9px] text-[#8a8a8e]">
            ◀
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded border border-[#c8c8cc] bg-[#e8e8ea] text-[9px] text-[#c0c0c4]">
            ▶
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded border border-[#c8c8cc] bg-white text-[10px] text-[#1f2a44]">
            ⊞
          </span>
          <span className="ml-1 flex-1 text-center text-[12px] font-semibold text-[#1c2438]">
            {title}
          </span>
          <span className="h-5 w-24 rounded-md border border-[#d0d0d4] bg-white text-[9px] text-[#9aa3b5]" />
        </div>
        <div className="bg-[#ececec] p-3">{children}</div>
      </div>
      <figcaption className="mt-2 px-1 text-center text-[11px] font-semibold leading-4 text-[#8b5060]">
        {caption}
      </figcaption>
    </figure>
  );
}

function MacAppleIdPane({
  sidebar,
  detail,
  caption,
  className = '',
}: {
  sidebar: ReactNode;
  detail: ReactNode;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={`mx-auto w-full max-w-[560px] ${className}`}>
      <div className="overflow-hidden rounded-[10px] border border-[#b8b8bd] bg-[#ececec] shadow-[0_16px_40px_rgba(28,36,56,.14)]">
        <div className="flex items-center gap-2 border-b border-[#d0d0d4] bg-[#f4f4f6] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded border border-[#c8c8cc] bg-white text-[9px] text-[#8a8a8e]">
            ◀
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded border border-[#c8c8cc] bg-white text-[10px] text-[#1f2a44]">
            ⊞
          </span>
          <span className="ml-1 flex-1 text-center text-[12px] font-semibold text-[#1c2438]">
            Apple ID
          </span>
          <span className="h-5 w-24 rounded-md border border-[#d0d0d4] bg-white" />
        </div>
        <div className="grid min-h-[240px] grid-cols-[34%_66%]">
          <div className="space-y-0.5 border-r border-[#d0d0d4] bg-[#e6e6ea] p-2">{sidebar}</div>
          <div className="bg-white p-3">{detail}</div>
        </div>
      </div>
      <figcaption className="mt-2 px-1 text-center text-[11px] font-semibold leading-4 text-[#8b5060]">
        {caption}
      </figcaption>
    </figure>
  );
}

function MacPrefsSidebarRow({
  label,
  hint,
  selected,
  highlight,
}: {
  label: string;
  hint?: string;
  selected?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-md px-2 py-1.5 ${
        selected ? 'bg-[#d6e6fb] text-[#1f2a44]' : 'text-[#1f2a44]'
      } ${highlight ? 'ring-2 ring-[#e11d2e] ring-offset-1 ring-offset-[#e6e6ea]' : ''}`}
    >
      <div className="truncate text-[11px] font-semibold">{label}</div>
      {hint && <div className="truncate text-[9px] text-[#6b778f]">{hint}</div>}
    </div>
  );
}

function PrefIcon({
  label,
  highlight,
  color,
}: {
  label: string;
  highlight?: boolean;
  color: string;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-lg px-1 py-1 ${
        highlight ? 'ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#ececec]' : ''
      }`}
    >
      <div className={`h-9 w-9 rounded-[22%] shadow-sm ${color}`} />
      <span className="max-w-[64px] text-center text-[9px] font-semibold leading-tight text-[#1f2a44]">
        {label}
      </span>
    </div>
  );
}

/** System Preferences → Apple ID card at top */
export function GuideMacLegacyAppleId({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <MacSysPrefsChrome
        caption=" → System Preferences… → click Apple ID (top of the window)."
        title="System Preferences"
      >
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-[#f6f6f8] px-3 py-2.5 ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#ececec]">
          <div className="h-11 w-11 shrink-0 rounded-full bg-[#c7c7cc]" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-[#1f2a44]">Your Name</div>
            <div className="truncate text-[11px] text-[#6b778f]">Apple ID, iCloud</div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-8 w-8 rounded-[22%] bg-gradient-to-br from-[#7ec8ff] to-[#0a7aff]" />
              <span className="text-[8px] font-semibold text-[#1f2a44]">Apple ID</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-8 w-8 rounded-[22%] bg-gradient-to-br from-[#ff9f7a] to-[#ff5a36]" />
              <span className="text-[8px] font-semibold text-[#1f2a44]">Family</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          <PrefIcon color="bg-gradient-to-br from-[#8e8e93] to-[#636366]" label="General" />
          <PrefIcon color="bg-gradient-to-br from-[#5ac8fa] to-[#007aff]" label="Desktop…" />
          <PrefIcon color="bg-gradient-to-br from-[#48484a] to-[#1c1c1e]" label="Dock…" />
          <PrefIcon color="bg-gradient-to-br from-[#af52de] to-[#5856d6]" label="Siri" />
          <PrefIcon color="bg-gradient-to-br from-[#34c759] to-[#30b0c7]" label="Network" />
          <PrefIcon color="bg-gradient-to-br from-[#ff9500] to-[#ff3b30]" label="Bluetooth" />
        </div>
      </MacSysPrefsChrome>
      <MacAppleIdPane
        caption="Overview shows the Apple ID email under your name — copy that."
        sidebar={
          <>
            <div className="mb-2 px-1 text-center">
              <div className="mx-auto mb-1 h-10 w-10 rounded-full bg-[#c7c7cc]" />
              <div className="truncate text-[11px] font-bold text-[#1f2a44]">Your Name</div>
            </div>
            <MacPrefsSidebarRow highlight label="Overview" selected />
            <MacPrefsSidebarRow label="Name, Phone, Email" />
            <MacPrefsSidebarRow label="Password & Security" />
            <MacPrefsSidebarRow label="Payment & Shipping" />
            <MacPrefsSidebarRow label="iCloud" />
            <MacPrefsSidebarRow label="Media & Purchases" />
          </>
        }
        detail={
          <div className="rounded-lg border border-[#e5e5ea] bg-[#f9f9fb] px-3 py-4 text-center">
            <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-[#c7c7cc]" />
            <div className="text-[15px] font-bold text-[#1f2a44]">Your Name</div>
            <div className="mt-1 text-[12px] font-semibold text-[#0a7aff] ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#f9f9fb]">
              name@example.com
            </div>
            <p className="mt-3 text-[10px] text-[#6b778f]">Apple ID · iCloud · Media & Purchases</p>
          </div>
        }
      />
    </div>
  );
}

/**  → About This Mac + System Preferences → Sharing → Computer Name */
export function GuideMacLegacyAbout({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <MacWindow
        caption=" menu → About This Mac — copy the macOS version (e.g. Monterey 12.x)."
        className={className}
        narrow
        title="About This Mac"
      >
        <div className="rounded-lg bg-white px-3 py-5 text-center">
          <div className="text-[15px] font-bold text-[#1f2a44]">iMac</div>
          <div className="mt-2 text-[12px] font-semibold text-[#1f2a44] ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-white">
            macOS Monterey
          </div>
          <div className="mt-1 text-[11px] text-[#6b778f]">Version 12.x</div>
        </div>
        <div className="flex justify-center gap-2 pt-1">
          <span className="rounded-md bg-[#e8e8ed] px-3 py-1.5 text-[11px] font-semibold text-[#1f2a44]">
            System Report…
          </span>
        </div>
      </MacWindow>
      <MacSysPrefsChrome
        caption="System Preferences → Sharing → Computer Name (this is the Mac’s Name)."
        title="Sharing"
      >
        <div className="rounded-lg bg-white px-3 py-3">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
            Computer Name
          </label>
          <div className="rounded-md border border-[#c8c8cc] bg-[#f9f9fb] px-3 py-2 text-[13px] font-semibold text-[#1f2a44] ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-white">
            Dad’s iMac
          </div>
          <p className="mt-2 text-[10px] text-[#6b778f]">
            Computers on your local network can access your computer at…
          </p>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1 opacity-50">
          {['File Sharing', 'Screen Sharing', 'Remote Login', 'Bluetooth'].map((label) => (
            <div key={label} className="rounded bg-white px-1 py-2 text-center text-[8px] text-[#6b778f]">
              {label}
            </div>
          ))}
        </div>
      </MacSysPrefsChrome>
    </div>
  );
}

/** Apple ID → Media & Purchases */
export function GuideMacLegacyMediaPurchases({ className }: GuideProps) {
  return (
    <MacAppleIdPane
      caption="Apple ID → Media & Purchases — note the account email (or “Not Signed In”)."
      className={className}
      sidebar={
        <>
          <div className="mb-2 px-1 text-center">
            <div className="mx-auto mb-1 h-10 w-10 rounded-full bg-[#c7c7cc]" />
            <div className="truncate text-[11px] font-bold text-[#1f2a44]">Your Name</div>
          </div>
          <MacPrefsSidebarRow label="Overview" />
          <MacPrefsSidebarRow label="iCloud" />
          <MacPrefsSidebarRow highlight hint="Account email" label="Media & Purchases" selected />
        </>
      }
      detail={
        <>
          <p className="mb-2 text-[11px] text-[#6b778f]">App Store, iTunes Store, Apple Books</p>
          <div className="rounded-lg border border-[#e5e5ea] bg-[#f9f9fb] px-3 py-3 ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-white">
            <div className="text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
              Account
            </div>
            <div className="mt-1 text-[13px] font-semibold text-[#1f2a44]">name@example.com</div>
            <div className="mt-3 inline-block rounded-md bg-[#e8e8ed] px-3 py-1.5 text-[11px] font-semibold text-[#1f2a44]">
              Manage…
            </div>
          </div>
        </>
      }
    />
  );
}

/** Messages → Preferences… → iMessage (Monterey wording) */
export function GuideMacLegacyMessages({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <MacWindow
        caption="Open Messages → Messages menu → Preferences…"
        className={className}
        narrow
        title="Messages"
      >
        <div className="rounded-lg border border-[#d8d8da] bg-white py-1">
          <div className="px-3 py-1.5 text-[12px] text-[#1f2a44]">About Messages</div>
          <div className="mx-1 rounded-md bg-[#0a7aff] px-2.5 py-1.5 text-[12px] font-semibold text-white ring-2 ring-[#e11d2e] ring-offset-1">
            Preferences…
          </div>
          <div className="px-3 py-1.5 text-[12px] text-[#1f2a44]">Services</div>
          <div className="px-3 py-1.5 text-[12px] text-[#1f2a44]">Quit Messages</div>
        </div>
      </MacWindow>
      <MacWindow caption="iMessage tab → You can be reached for messages at…" title="iMessage">
        <div className="mb-2 flex gap-2 text-[11px] font-semibold">
          <span className="rounded-md px-2 py-1 text-[#6b778f]">General</span>
          <span className="rounded-md bg-white px-2 py-1 text-[#0a7aff] ring-1 ring-[#0a7aff]/30">
            iMessage
          </span>
        </div>
        <MacDetailRow chevron={false} label="Apple ID" value="name@example.com" />
        <p className="px-1 pt-1 text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
          You can be reached for messages at
        </p>
        <MacDetailRow chevron={false} highlight label="Phone number" value="☑" />
        <MacDetailRow chevron={false} highlight label="name@example.com" value="☑" />
      </MacWindow>
    </div>
  );
}

/** Apple ID → iCloud → Contacts checkbox (Apps using iCloud) */
export function GuideMacLegacyContactsIcloud({ className }: GuideProps) {
  return (
    <MacAppleIdPane
      caption="Apple ID → iCloud → find Contacts in “Apps using iCloud” and note the checkbox."
      className={className}
      sidebar={
        <>
          <div className="mb-2 px-1 text-center">
            <div className="mx-auto mb-1 h-10 w-10 rounded-full bg-[#c7c7cc]" />
            <div className="truncate text-[11px] font-bold text-[#1f2a44]">Your Name</div>
          </div>
          <MacPrefsSidebarRow label="Overview" />
          <MacPrefsSidebarRow highlight label="iCloud" selected />
          <MacPrefsSidebarRow label="Media & Purchases" />
        </>
      }
      detail={
        <>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
            Apps using iCloud
          </p>
          <div className="space-y-1 rounded-lg border border-[#e5e5ea]">
            {[
              { label: 'Photos', on: true },
              { label: 'iCloud Drive', on: true },
              { label: 'Contacts', on: true, highlight: true },
              { label: 'Calendars', on: true },
              { label: 'Reminders', on: false },
              { label: 'Notes', on: true },
            ].map((row) => (
              <div
                key={row.label}
                className={`flex items-center gap-2 px-3 py-2 ${
                  row.highlight ? 'bg-[#fff5f5] ring-2 ring-inset ring-[#e11d2e]' : ''
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                    row.on
                      ? 'border-[#0a7aff] bg-[#0a7aff] text-white'
                      : 'border-[#c8c8cc] bg-white text-transparent'
                  }`}
                >
                  ✓
                </span>
                <span className="text-[12px] font-semibold text-[#1f2a44]">{row.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#6b778f]">
            <span>iCloud Storage · 5 GB</span>
            <span className="rounded-md bg-[#e8e8ed] px-2 py-1 font-semibold text-[#1f2a44]">
              Manage…
            </span>
          </div>
        </>
      }
    />
  );
}

/** Apple ID pane — devices listed at the bottom of the left sidebar */
export function GuideMacLegacyDevicesOnAccount({ className }: GuideProps) {
  return (
    <MacAppleIdPane
      caption="Apple ID → look at the device list under the sidebar (below Media & Purchases)."
      className={className}
      sidebar={
        <>
          <div className="mb-2 px-1 text-center">
            <div className="mx-auto mb-1 h-10 w-10 rounded-full bg-[#c7c7cc]" />
            <div className="truncate text-[11px] font-bold text-[#1f2a44]">Your Name</div>
          </div>
          <MacPrefsSidebarRow label="Overview" />
          <MacPrefsSidebarRow label="iCloud" />
          <MacPrefsSidebarRow label="Media & Purchases" />
          <div className="my-1.5 border-t border-[#c8c8cc]" />
          <div className="space-y-0.5 rounded-md ring-2 ring-[#e11d2e] ring-offset-1 ring-offset-[#e6e6ea]">
            <MacPrefsSidebarRow hint="This Mac" label="iMac" selected />
            <MacPrefsSidebarRow hint="iPhone" label="Mum’s iPhone" />
            <MacPrefsSidebarRow hint="iPad" label="Dad’s iPad" />
          </div>
        </>
      }
      detail={
        <div className="rounded-lg border border-[#e5e5ea] bg-[#f9f9fb] px-3 py-4 text-center">
          <div className="text-[13px] font-bold text-[#1f2a44]">Devices on this Apple ID</div>
          <p className="mt-2 text-[11px] leading-4 text-[#6b778f]">
            Compare this sidebar list with the household cards below. Type any extra names under Other devices listed.
          </p>
        </div>
      }
    />
  );
}

/* ─── Older iPad (two-column Settings) ──────────────────────────────── */

function IpadSettingsChrome({
  sidebar,
  detailTitle,
  detail,
  caption,
  className = '',
}: {
  sidebar: ReactNode;
  detailTitle: string;
  detail: ReactNode;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={`mx-auto w-full max-w-[560px] ${className}`}>
      <div className="overflow-hidden rounded-[18px] border-[3px] border-[#1c2438] bg-[#f2f3f7] shadow-[0_16px_40px_rgba(28,36,56,.18)]">
        <div className="flex items-center justify-center bg-[#1c2438] px-4 pb-2 pt-3">
          <div className="h-1.5 w-20 rounded-full bg-[#4a556e]" />
        </div>
        <div className="grid min-h-[220px] grid-cols-[42%_58%]">
          <div className="space-y-1 border-r border-[#d8dce6] bg-[#ebebf0] p-2.5">{sidebar}</div>
          <div className="bg-[#f2f3f7]">
            <div className="border-b border-[#d8dce6] bg-white px-3 py-2.5 text-center text-[12px] font-bold text-[#1c2438]">
              {detailTitle}
            </div>
            <div className="space-y-1.5 p-2.5">{detail}</div>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 px-1 text-center text-[11px] font-semibold leading-4 text-[#8b5060]">
        {caption}
      </figcaption>
    </figure>
  );
}

function IpadSidebarRow({
  label,
  hint,
  selected,
  highlight,
}: {
  label: string;
  hint?: string;
  selected?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg px-2.5 py-2 ${
        selected ? 'bg-[#3478f6] text-white' : 'bg-white text-[#1f2a44]'
      } ${highlight ? 'ring-2 ring-[#e11d2e] ring-offset-1 ring-offset-[#ebebf0]' : ''}`}
    >
      <div className="truncate text-[12px] font-semibold">{label}</div>
      {hint && (
        <div className={`truncate text-[10px] ${selected ? 'text-white/80' : 'text-[#6b778f]'}`}>
          {hint}
        </div>
      )}
    </div>
  );
}

function IpadDetailRow({
  label,
  value,
  highlight,
  chevron = true,
  toggleOn,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
  chevron?: boolean;
  toggleOn?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 ${
        highlight ? 'ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#f2f3f7]' : ''
      }`}
    >
      <div className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#1f2a44]">{label}</div>
      {typeof toggleOn === 'boolean' ? (
        <span
          className={`relative h-5 w-9 shrink-0 rounded-full ${toggleOn ? 'bg-[#34c759]' : 'bg-[#d1d1d6]'}`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow ${
              toggleOn ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </span>
      ) : (
        <>
          {value && <span className="shrink-0 text-[11px] text-[#6b778f]">{value}</span>}
          {chevron && <span className="text-[#9aa3b5]">›</span>}
        </>
      )}
    </div>
  );
}

/** Older iPadOS two-column: left sidebar Apple ID card */
export function GuideIpadAppleId({ className }: GuideProps) {
  return (
    <IpadSettingsChrome
      caption="iPad Settings is two columns: left sidebar → tap your name (Apple ID, iCloud, Media & Purchases)."
      className={className}
      detailTitle="Apple ID"
      detail={
        <>
          <div className="rounded-xl bg-white px-3 py-3 text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-[#c7c7cc]" />
            <div className="text-[13px] font-bold text-[#1f2a44]">Your Name</div>
            <div className="text-[11px] text-[#6b778f]">name@example.com</div>
          </div>
          <IpadDetailRow label="iCloud" value="5 GB" />
          <IpadDetailRow label="Media & Purchases" />
          <IpadDetailRow label="Find My" />
        </>
      }
      sidebar={
        <>
          <IpadSidebarRow
            highlight
            hint="Apple ID, iCloud, Media & Purchases"
            label="Your Name"
            selected
          />
          <IpadSidebarRow label="Airplane Mode" />
          <IpadSidebarRow hint="Network" label="Wi-Fi" />
          <IpadSidebarRow hint="On" label="Bluetooth" />
          <IpadSidebarRow label="General" />
        </>
      }
    />
  );
}

/** Older iPadOS two-column: General (left) + About Name / iPadOS Version (right) */
export function GuideIpadAbout({ className }: GuideProps) {
  return (
    <IpadSettingsChrome
      caption="Left sidebar → General. Right pane → About → Name and iPadOS Version."
      className={className}
      detailTitle="About"
      detail={
        <>
          <IpadDetailRow highlight label="Name" value="iPad" />
          <IpadDetailRow highlight label="iPadOS Version" value="16.6.1" />
          <IpadDetailRow label="Model Name" value="iPad" />
        </>
      }
      sidebar={
        <>
          <IpadSidebarRow hint="Apple ID, iCloud, Media & Purchases" label="Your Name" />
          <IpadSidebarRow label="Wi-Fi" />
          <IpadSidebarRow label="Bluetooth" />
          <IpadSidebarRow highlight label="General" selected />
          <IpadSidebarRow label="Control Centre" />
        </>
      }
    />
  );
}

/** Older iPadOS two-column: Apple ID → Media & Purchases on the right pane */
export function GuideIpadMediaPurchases({ className }: GuideProps) {
  return (
    <IpadSettingsChrome
      caption="Left: your Apple ID. Right pane → Media & Purchases."
      className={className}
      detailTitle="Apple ID"
      detail={
        <>
          <IpadDetailRow label="Name, Phone Numbers, Email" />
          <IpadDetailRow label="Password & Security" />
          <IpadDetailRow label="Payment & Shipping" />
          <IpadDetailRow label="Subscriptions" />
          <div className="h-1" />
          <IpadDetailRow label="iCloud" value="5 GB" />
          <IpadDetailRow highlight label="Media & Purchases" />
          <IpadDetailRow label="Find My" />
        </>
      }
      sidebar={
        <>
          <IpadSidebarRow
            hint="Apple ID, iCloud, Media & Purchases"
            label="Your Name"
            selected
          />
          <IpadSidebarRow label="Wi-Fi" />
          <IpadSidebarRow label="General" />
        </>
      }
    />
  );
}

/** Older iPadOS two-column: sidebar Messages + Send & Receive on the right */
export function GuideIpadMessages({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <IpadSettingsChrome
        caption="Left sidebar → Messages (not under Apps). Right pane → Send & Receive."
        className={className}
        detailTitle="Messages"
        detail={
          <>
            <IpadDetailRow label="iMessage" toggleOn />
            <IpadDetailRow highlight label="Send & Receive" value="2 Addresses" />
            <IpadDetailRow label="Share Name and Photo" value="Off" />
            <IpadDetailRow label="Shared with You" value="Off" />
          </>
        }
        sidebar={
          <>
            <IpadSidebarRow label="Mail" />
            <IpadSidebarRow label="Contacts" />
            <IpadSidebarRow label="Calendar" />
            <IpadSidebarRow label="Notes" />
            <IpadSidebarRow highlight label="Messages" selected />
            <IpadSidebarRow label="FaceTime" />
            <IpadSidebarRow label="Safari" />
          </>
        }
      />
      <IpadSettingsChrome
        caption="Right pane: You can receive iMessages to and reply from…"
        detailTitle="iMessage"
        detail={
          <>
            <p className="px-1 pb-1 text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
              You can receive iMessages to and reply from
            </p>
            <IpadDetailRow chevron={false} highlight label="Phone number" value="✓" />
            <IpadDetailRow chevron={false} highlight label="name@example.com" value="✓" />
            <p className="px-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
              Start new conversations from
            </p>
            <IpadDetailRow chevron={false} label="Phone number / email" />
          </>
        }
        sidebar={
          <>
            <IpadSidebarRow label="Notes" />
            <IpadSidebarRow highlight label="Messages" selected />
            <IpadSidebarRow label="FaceTime" />
          </>
        }
      />
    </div>
  );
}

/** Older iPadOS two-column: iCloud → Show All → Contacts */
export function GuideIpadContactsIcloud({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <IpadSettingsChrome
        caption="Right pane: iCloud → Apps Using iCloud → Show All."
        className={className}
        detailTitle="iCloud"
        detail={
          <>
            <p className="px-1 text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
              Apps Using iCloud
            </p>
            <IpadDetailRow label="Photos" value="On" />
            <IpadDetailRow label="iCloud Drive" value="On" />
            <IpadDetailRow label="Passwords and Keychain" value="Off" />
            <IpadDetailRow highlight label="Show All" />
          </>
        }
        sidebar={
          <>
            <IpadSidebarRow
              hint="Apple ID, iCloud, Media & Purchases"
              label="Your Name"
              selected
            />
            <IpadSidebarRow label="General" />
          </>
        }
      />
      <IpadSettingsChrome
        caption="Right pane: find Contacts and note whether the switch is on."
        detailTitle="Apps using iCloud"
        detail={
          <>
            <IpadDetailRow label="Notes" value="On" />
            <IpadDetailRow label="Messages" value="Off" />
            <IpadDetailRow highlight label="Contacts" toggleOn />
            <IpadDetailRow label="Calendars" toggleOn />
          </>
        }
        sidebar={
          <>
            <IpadSidebarRow
              hint="Apple ID, iCloud, Media & Purchases"
              label="Your Name"
              selected
            />
            <IpadSidebarRow label="General" />
          </>
        }
      />
    </div>
  );
}

/** Older iPadOS: Apple ID right pane — scroll to Devices list */
export function GuideIpadDevicesOnAccount({ className }: GuideProps) {
  return (
    <IpadSettingsChrome
      caption="Still on your Apple ID: scroll the right pane to Devices."
      className={className}
      detailTitle="Apple ID"
      detail={
        <>
          <div className="rounded-xl bg-[#f2f3f7] px-3 py-2 text-center opacity-60">
            <div className="text-[13px] font-bold text-[#1f2a44]">Your Name</div>
            <div className="text-[11px] text-[#6b778f]">name@example.com</div>
          </div>
          <IpadDetailRow label="iCloud" value="5 GB" />
          <IpadDetailRow label="Media & Purchases" />
          <p className="px-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-[#6b778f]">
            Devices
          </p>
          <div className="space-y-1 rounded-xl bg-white p-1 ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#f2f3f7]">
            <IpadDetailRow chevron={false} label="iPad" value="This iPad" />
            <IpadDetailRow chevron={false} label="iPhone" />
            <IpadDetailRow chevron={false} label="iMac" />
          </div>
        </>
      }
      sidebar={
        <>
          <IpadSidebarRow
            hint="Apple ID, iCloud, Media & Purchases"
            label="Your Name"
            selected
          />
          <IpadSidebarRow label="General" />
          <IpadSidebarRow label="Messages" />
        </>
      }
    />
  );
}

/** iPhone Watch app → My Watch (pairing home) */
export function GuideWatchMyWatch({ className }: GuideProps) {
  return (
    <PhoneChrome
      caption="On the iPhone: open the Watch app (black watch icon). My Watch should show this Apple Watch."
      className={className}
      title="Watch"
    >
      <div className="mb-1 flex gap-1 rounded-lg bg-white p-1 text-center text-[10px] font-bold">
        <span className="flex-1 rounded-md bg-[#0a7aff] px-2 py-1.5 text-white">My Watch</span>
        <span className="flex-1 rounded-md px-2 py-1.5 text-[#6b778f]">Face Gallery</span>
        <span className="flex-1 rounded-md px-2 py-1.5 text-[#6b778f]">Discover</span>
      </div>
      <div className="rounded-xl bg-white px-3 py-3 ring-2 ring-[#e11d2e] ring-offset-2 ring-offset-[#f2f3f7]">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-full bg-[#1c2438]">
            <span className="h-7 w-7 rounded-full border-2 border-[#8e8e93] bg-[#2c2c2e]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-[#1f2a44]">Mum’s Apple Watch</div>
            <div className="truncate text-[11px] text-[#6b778f]">Paired · My Watch</div>
          </div>
        </div>
      </div>
      <Row label="General" />
      <Row label="App Layout" />
      <Row label="Notifications" />
    </PhoneChrome>
  );
}

/** iPhone Watch app → My Watch → General → About */
export function GuideWatchAbout({ className }: GuideProps) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <PhoneChrome caption="Still on that iPhone: Watch app → My Watch → General." title="Watch · My Watch">
        <Row highlight label="General" />
        <Row label="App Layout" />
        <Row label="Notifications" />
      </PhoneChrome>
      <PhoneChrome
        caption="General → About — copy the name and Software Version."
        title="Watch · General"
      >
        <Row highlight hint="Name, model, watchOS" label="About" />
        <Row label="Software Update" />
        <Row label="Orientation" />
      </PhoneChrome>
      <PhoneChrome caption="On About: copy these two lines." title="About">
        <Row highlight label="Name" value="Mum’s Apple Watch" />
        <Row highlight label="Software Version" value="10.x" />
        <Row label="Model" value="Apple Watch" />
      </PhoneChrome>
    </div>
  );
}
