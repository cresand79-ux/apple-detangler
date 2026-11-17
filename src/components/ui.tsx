import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export function PathHint({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 flex items-start gap-2 text-[13px] font-medium leading-5 text-[#68758c]">
      <span className="mt-0.5 shrink-0 text-[#7a88c7]">→</span>
      <span>{children}</span>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-bold text-[#23304a] md:text-[18px]">
        {label}
      </span>
      {children}
      {hint && <PathHint>{hint}</PathHint>}
    </label>
  );
}

export function SelectField({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        className="h-[52px] w-full appearance-none rounded-xl border border-[#cfd6e3] bg-white px-4 pr-11 text-base font-medium text-[#25324b] outline-none transition hover:border-[#aab4c7] focus:border-[#4356b4] focus:ring-4 focus:ring-[#4356b4]/10"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 text-[#6a758a]"
        size={18}
      />
    </div>
  );
}

export function StepHeader({ n, title, subtitle }: { n: number; title: string; subtitle: string }) {
  return (
    <div className="mb-7 flex items-center gap-4 border-b border-[#edf0f4] pb-5">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#edf0ff] text-sm font-extrabold text-[#4052ac]">
        {n}
      </span>
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-0.5 text-sm text-[#737e92]">{subtitle}</p>
      </div>
    </div>
  );
}
