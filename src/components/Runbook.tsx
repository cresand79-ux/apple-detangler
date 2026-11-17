import { AlertTriangle, ArrowLeft, Check, Copy, Link2 } from 'lucide-react';
import { useState } from 'react';
import { buildShareUrl, copyText, encodePlan } from '../lib/hashCodec';
import type { MasterPlan } from '../types';

export function Runbook({
  plan,
  done,
  onToggleStep,
  onBack,
}: {
  plan: MasterPlan;
  done: Record<string, boolean>;
  onToggleStep: (stepId: string) => void;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyPlanLink = async () => {
    const url = buildShareUrl(`#plan=${encodePlan(plan)}`);
    const ok = await copyText(url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-[920px] px-5 py-8 md:px-8 md:py-10">
      <button
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#4052a8]"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={16} /> Back to Master Matrix
      </button>

      <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#5363b1]">
        Custom runbook · {plan.phases.length} phases
      </p>
      <h1 className="text-[30px] font-bold tracking-[-.035em] md:text-[40px]">
        Household untangle plan
      </h1>
      <p className="mt-2 max-w-2xl text-base text-[#68758c]">
        Generated from the current device matrix. Share the compressed{' '}
        <code className="rounded bg-[#eef1ff] px-1.5 py-0.5 text-sm">#plan=</code> link — nothing is
        stored on a server.
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button className="primary-button" onClick={copyPlanLink} type="button">
          {copied ? (
            <>
              <Check size={18} /> Plan link copied
            </>
          ) : (
            <>
              <Link2 size={18} /> Copy #plan= Runbook Link
            </>
          )}
        </button>
        <button
          className="secondary-button"
          onClick={() => copyText(JSON.stringify(plan, null, 2))}
          type="button"
        >
          <Copy size={18} /> Copy JSON
        </button>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-[#e11d2e] bg-[#fff0eb] p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-[#e11d2e]" size={22} />
          <div>
            <h2 className="text-lg font-extrabold uppercase tracking-wide text-[#e11d2e]">
              KEEP A COPY
            </h2>
            <p className="mt-1 text-[15px] font-semibold leading-6 text-[#7a2f24]">
              Before any Apple ID sign-out: export Contacts, note Calendars, and confirm Keychain /
              passwords are already saved elsewhere. Do not skip Phase 2.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {plan.phases.map((phase, index) => (
          <section
            className="rounded-2xl border border-[#e0e4ec] bg-white p-5 shadow-[0_10px_35px_rgba(31,44,78,.055)] md:p-8"
            key={phase.id}
          >
            <div className="mb-5 flex items-start gap-4 border-b border-[#edf0f4] pb-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf0ff] text-sm font-extrabold text-[#4052ac]">
                {index + 1}
              </span>
              <div>
                <h2 className="text-xl font-bold">{phase.title}</h2>
                <p className="mt-0.5 text-sm text-[#737e92]">{phase.summary}</p>
              </div>
            </div>
            <ul className="space-y-3">
              {phase.steps.map((step) => {
                const isDone = Boolean(done[step.id]);
                return (
                  <li key={step.id}>
                    {step.keepCopyWarning && (
                      <div className="mb-2 rounded-xl border-2 border-[#e11d2e] bg-[#fff5f3] px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-[#e11d2e]">
                        KEEP A COPY — Contacts · Calendars · Keychain
                      </div>
                    )}
                    <label
                      className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition ${
                        isDone
                          ? 'border-[#cce8de] bg-[#eaf7f2]'
                          : 'border-[#e4e8f0] bg-[#fafbfe] hover:border-[#c5cde3]'
                      }`}
                    >
                      <input
                        checked={isDone}
                        className="mt-1 h-4 w-4 accent-[#3446a5]"
                        onChange={() => onToggleStep(step.id)}
                        type="checkbox"
                      />
                      <span>
                        <span className="block text-[15px] font-bold text-[#23304a]">
                          {step.title}
                        </span>
                        <span className="mt-1 block text-sm leading-5 text-[#5c6a82]">
                          {step.body}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
