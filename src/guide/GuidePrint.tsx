import { DAD_EMAIL, DAD_PHONE, MUM_EMAIL, MUM_PHONE } from './household';
import { panels } from './panels';
import { SECTION_NAMES, type Owner, type Panel } from './types';
import { UiStoryScene } from './UiStoryScene';

const ownerLabel: Record<Owner, string> = {
  dad: 'Dad',
  mum: 'Mum',
  shared: 'Shared',
  danger: 'Stop',
};

function PrintStepCard({
  panel,
  globalIndex,
  sectionStep,
}: {
  panel: Panel;
  globalIndex: number;
  sectionStep: string;
}) {
  const isIntro = panel.presentation === 'intro';

  return (
    <article className={`guide-print-card owner-${panel.owner}`}>
      <header className="guide-print-card-head">
        <span className="guide-print-badge">{sectionStep}</span>
        <div>
          <p className="guide-print-owner">
            {ownerLabel[panel.owner]}
            {panel.ui === 'success' ? ' · Checkpoint' : isIntro ? ' · Intro' : ''}
            {panel.tapTarget && !isIntro && panel.ui !== 'success'
              ? ` · Tap ${panel.tapTarget}`
              : ''}
          </p>
          <h3>{panel.title}</h3>
          <p className="guide-print-device">
            {panel.deviceLabel} · {panel.osLabel}
          </p>
        </div>
        <span className="guide-print-global">#{globalIndex + 1}</span>
      </header>

      <div className="guide-print-graphic">
        <UiStoryScene panel={panel} />
      </div>

      {!isIntro && <p className="guide-print-caption">{panel.caption}</p>}
      {panel.path && !isIntro && <p className="guide-print-path">Path · {panel.path}</p>}
      {panel.warning && <p className="guide-print-warn">{panel.warning}</p>}
    </article>
  );
}

export function GuidePrint() {
  const bySection = SECTION_NAMES.map((name, index) => {
    const section = index + 1;
    const steps = panels.filter((p) => p.section === section);
    const startIndex = panels.findIndex((p) => p.section === section);
    return { name, section, steps, startIndex };
  });

  return (
    <div className="guide-print" aria-hidden>
      <header className="guide-print-cover">
        <h1>Mum & Dad Apple setup</h1>
        <p className="guide-print-sub">
          Illustrated A4 guide · print double-sided · follow the red ring on each picture
        </p>
        <div className="guide-print-contacts">
          <div>
            <strong>Mum</strong>
            <span>{MUM_EMAIL}</span>
            <span>{MUM_PHONE}</span>
          </div>
          <div>
            <strong>Dad</strong>
            <span>{DAD_EMAIL}</span>
            <span>{DAD_PHONE}</span>
          </div>
        </div>
        <ul className="guide-print-rules">
          <li>
            Prefer online: keep the guide open on Mum’s MacBook or Dad’s iMac while tapping the
            phone/iPad — or use this printout
          </li>
          <li>One device at a time — only the device named on the card</li>
          <li>Tap what the red ring highlights on the picture</li>
          <li>Never choose Erase when signing out</li>
          <li>Stop and call Andy if Payment appears</li>
        </ul>
      </header>

      {bySection.map(({ name, section, steps, startIndex }) => (
        <section className="guide-print-section" key={section}>
          <h2>
            Section {section} · {name}
          </h2>
          <div className="guide-print-grid">
            {steps.map((step, i) => (
              <PrintStepCard
                globalIndex={startIndex + i}
                key={step.id}
                panel={step}
                sectionStep={`${section}.${i + 1}`}
              />
            ))}
          </div>
        </section>
      ))}

      <footer className="guide-print-footer">
        End of illustrated guide · Online: /apple-detangler/guide/
      </footer>
    </div>
  );
}
