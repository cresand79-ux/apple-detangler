import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Phone, Printer } from 'lucide-react';
import { navigateToMode } from '../lib/appMode';
import { GuidePrint } from './GuidePrint';
import { DAD_EMAIL, DAD_PHONE, MUM_EMAIL, MUM_PHONE } from './household';
import { panels } from './panels';
import { SECTION_NAMES, type Owner, type Panel } from './types';
import { UiStoryScene } from './UiStoryScene';

const ownerAccent: Record<Owner, string> = {
  dad: 'bg-[#3b6ea5]',
  mum: 'bg-[#2f7a5b]',
  shared: 'bg-[#b8841d]',
  danger: 'bg-[#c0392b]',
};

const ownerLabel: Record<Owner, string> = {
  dad: 'Dad',
  mum: 'Mum',
  shared: 'Shared',
  danger: 'Stop',
};

function PanelCard({ panel, index }: { panel: Panel; index: number }) {
  const isIntro = panel.presentation === 'intro';

  return (
    <article className="overflow-hidden rounded-2xl border border-[#dfe4ec] bg-white shadow-[0_8px_28px_rgba(31,44,78,.06)]">
      <div className={`h-1.5 w-full ${ownerAccent[panel.owner]}`} />
      <div className="flex items-start gap-3 border-b border-[#eef1f6] px-5 py-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf0ff] text-sm font-extrabold text-[#4052ac]">
          {index + 1}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white ${ownerAccent[panel.owner]}`}
            >
              {ownerLabel[panel.owner]}
            </span>
            <span className="text-[12px] font-semibold text-[#69748c]">{panel.card}</span>
            {isIntro && (
              <span className="rounded-full bg-[#f1f3f8] px-2.5 py-0.5 text-[11px] font-bold text-[#69748c]">
                Intro
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] font-bold uppercase tracking-[.04em] text-[#5363b1]">
            {panel.eyebrow}
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-[#68758c]">
            {panel.deviceLabel} · {panel.osLabel}
          </p>
        </div>
      </div>

      <div className={`px-4 py-6 md:px-6 ${isIntro ? 'bg-white' : 'bg-[#f7f8fb]'}`}>
        <UiStoryScene panel={panel} />
      </div>

      <div className="border-t border-[#eef1f6] px-5 py-4">
        <h1 className="text-[22px] font-bold tracking-[-.02em] text-[#202d47]">{panel.title}</h1>
        {!isIntro && (
          <>
            <p className="mt-1 text-[15px] leading-6 text-[#4d5a78]">{panel.caption}</p>
            {panel.warning && (
              <p className="mt-3 rounded-xl border border-[#f0c4c4] bg-[#fff5f5] px-3 py-2 text-[13px] font-bold text-[#a12828]">
                {panel.warning}
              </p>
            )}
          </>
        )}
      </div>
    </article>
  );
}

function HelperStrip() {
  const items = [
    'Keep this guide open on Mum’s MacBook or Dad’s iMac while you tap on the phone/iPad',
    'Or print the illustrated A4 pages and work from paper',
    'Read the step · point to the red ring · parent unlocks',
    'If Payment appears — stop and call Andy',
  ];
  return (
    <aside className="rounded-2xl border border-[#dfe4ec] bg-white p-4 shadow-[0_6px_20px_rgba(31,44,78,.04)]">
      <div className="mb-3 flex items-center gap-2 text-[13px] font-bold text-[#24304a]">
        <Phone size={16} className="text-[#4052ac]" />
        How to follow along
      </div>
      <ol className="space-y-2">
        {items.map((label, i) => (
          <li className="flex gap-2 text-[13px] leading-5 text-[#4d5a78]" key={label}>
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#edf0ff] text-[11px] font-bold text-[#4052ac]">
              {i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[12px] leading-5 text-[#8b95a8]">
        Safari cannot open Settings on the phone/iPad for you — use a second screen or the printout.
      </p>
    </aside>
  );
}

export function GuideApp() {
  const [current, setCurrent] = useState(0);
  const panel = panels[current];
  const sectionPanels = useMemo(
    () => panels.filter((item) => item.section === panel.section),
    [panel.section],
  );
  const sectionIndex = sectionPanels.findIndex((item) => item.id === panel.id);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setCurrent((value) => Math.min(value + 1, panels.length - 1));
      if (event.key === 'ArrowLeft') setCurrent((value) => Math.max(value - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const move = (direction: number) => {
    setCurrent((value) => Math.max(0, Math.min(value + direction, panels.length - 1)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToSection = (section: number) => {
    const idx = panels.findIndex((item) => item.section === section);
    if (idx >= 0) {
      setCurrent(idx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#17233c]">
      <header className="border-b border-[#dfe4ee] bg-white">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-5 py-5 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#3446a5] text-white">
                <BookOpen size={22} />
              </span>
              <div>
                <h1 className="text-[22px] font-bold tracking-[-.02em] md:text-[26px]">
                  Mum & Dad Apple setup
                </h1>
                <p className="mt-0.5 text-[14px] text-[#68758c]">
                  One device at a time · tap what the red ring shows
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="primary-button text-[13px]"
                onClick={() => window.print()}
                type="button"
              >
                <Printer size={16} /> Print illustrated A4
              </button>
              <button
                className="secondary-button text-[13px]"
                onClick={() => navigateToMode('collect')}
                type="button"
              >
                Back to device check
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#cfe0f5] bg-[#f3f7fd] px-4 py-3 text-[14px] leading-5 text-[#2f4a6e]">
            <strong className="font-bold">Easiest setup:</strong> leave this guide open on{' '}
            <strong>Mum’s MacBook</strong> or <strong>Dad’s iMac</strong> while you work on the
            phone or iPad. Or use <strong>Print illustrated A4</strong> and follow from paper.
          </div>

          <div className="flex flex-wrap gap-2 text-[12px] font-semibold">
            <span className="rounded-lg bg-[#f1f3f8] px-3 py-1.5 text-[#3a4660]">
              Mum · {MUM_EMAIL} · {MUM_PHONE}
            </span>
            <span className="rounded-lg bg-[#f1f3f8] px-3 py-1.5 text-[#3a4660]">
              Dad · {DAD_EMAIL} · {DAD_PHONE}
            </span>
          </div>

          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium text-[#4d5a78]">
            <li>Only the named device</li>
            <li>Unlock when asked</li>
            <li>Stop if unsure — call Andy</li>
          </ul>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1100px] gap-6 px-5 py-6 md:grid-cols-[1fr_260px] md:px-8 md:py-8">
        <div className="min-w-0 space-y-4">
          <nav aria-label="Guide sections" className="flex flex-wrap gap-2">
            {SECTION_NAMES.map((name, index) => {
              const active = panel.section === index + 1;
              return (
                <button
                  className={`rounded-full px-3.5 py-2 text-[13px] font-bold transition ${
                    active
                      ? 'bg-[#3446a5] text-white'
                      : 'bg-white text-[#3a4660] ring-1 ring-[#d3d9e6] hover:bg-[#f5f7fb]'
                  }`}
                  key={name}
                  onClick={() => jumpToSection(index + 1)}
                  type="button"
                >
                  {index + 1}. {name}
                </button>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-[14px] font-bold text-[#24304a]">
              {panel.deviceLabel} · {String(sectionIndex + 1).padStart(2, '0')} of{' '}
              {String(sectionPanels.length).padStart(2, '0')}
              {panel.ui === 'success'
                ? ' — Checkpoint'
                : panel.presentation === 'intro'
                  ? ' — Intro'
                  : panel.tapTarget
                    ? ` — Tap ${panel.tapTarget}`
                    : ''}
            </p>
            <p className="text-[12px] font-semibold text-[#69748c]">
              Step {current + 1} of {panels.length}
            </p>
          </div>

          <div aria-hidden className="h-2 overflow-hidden rounded-full bg-[#e4e8f0]">
            <div
              className="h-full rounded-full bg-[#3446a5] transition-all"
              style={{ width: `${((current + 1) / panels.length) * 100}%` }}
            />
          </div>

          <PanelCard index={current} panel={panel} />

          <nav aria-label="Panel navigation" className="flex gap-3">
            <button
              className="secondary-button flex-1"
              disabled={current === 0}
              onClick={() => move(-1)}
              type="button"
            >
              ← Back
            </button>
            <button
              className="primary-button flex-1"
              disabled={current === panels.length - 1}
              onClick={() => move(1)}
              type="button"
            >
              {current === panels.length - 1 ? 'Guide complete' : 'Next →'}
            </button>
          </nav>
          <p className="text-center text-[12px] font-medium text-[#8b95a8]">
            Arrow keys also work
          </p>
        </div>

        <div className="space-y-4 md:sticky md:top-6 md:self-start">
          <HelperStrip />
          <aside className="rounded-2xl border border-[#dfe4ec] bg-white p-4 text-[12px] leading-5 text-[#68758c]">
            <p className="font-bold text-[#24304a]">Colour key</p>
            <ul className="mt-2 space-y-1.5">
              {(
                [
                  ['dad', 'Dad’s device'],
                  ['mum', 'Mum’s device'],
                  ['shared', 'Shared step'],
                  ['danger', 'Do not do this'],
                ] as const
              ).map(([key, label]) => (
                <li className="flex items-center gap-2" key={key}>
                  <span className={`h-2.5 w-2.5 rounded-full ${ownerAccent[key]}`} />
                  {label}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>

      <GuidePrint />
    </div>
  );
}
