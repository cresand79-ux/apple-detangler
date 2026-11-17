import type { ReactNode } from 'react';

type GuideProps = { className?: string };

function PhoneChrome({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
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
}

function Row({
  label,
  hint,
  highlight,
  chevron = true,
}: {
  label: string;
  hint?: string;
  highlight?: boolean;
  chevron?: boolean;
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
      {chevron && <span className="text-[#9aa3b5]">›</span>}
    </div>
  );
}

/** Settings → tap Name at top */
export function GuideNameAtTop({ className }: GuideProps) {
  return (
    <PhoneChrome className={className} title="Settings">
      <Row highlight hint="name@icloud.com" label="Your Name" />
      <Row label="Apple Account" hint="iCloud, Media & Purchases" />
      <Row label="General" />
      <Row label="Accessibility" />
      <p className="px-1 pt-2 text-[11px] font-semibold leading-4 text-[#8b5060]">
        Red ring: tap your name at the top of Settings.
      </p>
    </PhoneChrome>
  );
}

/** Settings → General → About */
export function GuideGeneralAbout({ className }: GuideProps) {
  return (
    <PhoneChrome className={className} title="General">
      <Row label="About" highlight />
      <Row label="Software Update" />
      <Row label="AirDrop" />
      <Row label="iPhone Storage" />
      <p className="px-1 pt-2 text-[11px] font-semibold leading-4 text-[#8b5060]">
        Path: Settings → General → About (name & software version).
      </p>
    </PhoneChrome>
  );
}

/** Media & Purchases → View Account */
export function GuideMediaPurchases({ className }: GuideProps) {
  return (
    <PhoneChrome className={className} title="Media & Purchases">
      <Row label="View Account" highlight hint="Shows purchase Apple ID" />
      <Row label="Subscriptions" />
      <Row label="Purchase History" />
      <p className="px-1 pt-2 text-[11px] font-semibold leading-4 text-[#8b5060]">
        Settings → Name → Media & Purchases → View Account.
      </p>
    </PhoneChrome>
  );
}

/** Settings → Apps → Messages → Send & Receive */
export function GuideMessagesSendReceive({ className }: GuideProps) {
  return (
    <PhoneChrome className={className} title="Messages">
      <Row label="iMessage" hint="On" chevron={false} />
      <Row label="Send & Receive" highlight hint="Addresses & phone numbers" />
      <Row label="Share Name and Photo" />
      <p className="px-1 pt-2 text-[11px] font-semibold leading-4 text-[#8b5060]">
        Settings → Apps → Messages → Send & Receive (or Settings → Messages on older iOS).
      </p>
    </PhoneChrome>
  );
}

/** Watch app → General → About */
export function GuideWatchAbout({ className }: GuideProps) {
  return (
    <PhoneChrome className={className} title="Watch · General">
      <Row label="About" highlight hint="Name, model, watchOS" />
      <Row label="Software Update" />
      <Row label="Orientation" />
      <p className="px-1 pt-2 text-[11px] font-semibold leading-4 text-[#8b5060]">
        On the paired iPhone: Watch app → My Watch → General → About.
      </p>
    </PhoneChrome>
  );
}
