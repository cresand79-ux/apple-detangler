import { analyzeConflicts } from './conflicts';
import type { DeviceCI, MasterPlan, RunbookPhase } from '../types';

export function generateRunbook(devices: DeviceCI[]): MasterPlan {
  const flags = analyzeConflicts(devices);
  const now = new Date().toISOString();

  const phase1: RunbookPhase = {
    id: 'phase-1-audit',
    title: 'Phase 1 — Capture what is on each device',
    summary: 'Finish missing device checks. No sign-outs yet.',
    steps: devices.map((d) => ({
      id: `audit:${d.id}`,
      deviceId: d.id,
      title: `Confirm passport for ${d.name}`,
      body: d.checked
        ? `Already checked. Primary: ${d.primaryAppleId || 'not recorded'}. OS: ${d.softwareVersion || 'not recorded'}.`
        : `Open the inspector for ${d.name} and fill Primary Apple Account, Media & Purchases, Messages/FaceTime, and software version.`,
    })),
  };

  const risky = devices.filter(
    (d) =>
      d.platform !== 'watchOS' &&
      (d.contactsIcloud === 'Yes — switched on' ||
        d.primaryAppleId.trim() ||
        flags.some((f) => f.deviceIds.includes(d.id) && f.severity === 'conflict')),
  );

  const phase2: RunbookPhase = {
    id: 'phase-2-backup',
    title: 'Phase 2 — KEEP A COPY before any sign-out',
    summary: 'Export or screenshot Contacts, Calendars, and confirm Keychain backup.',
    steps: [
      {
        id: 'keep-copy-global',
        title: 'KEEP A COPY — Contacts, Calendars, Keychain',
        body: 'Before signing out of any Apple ID, export Contacts (vCard), note Calendar accounts, and ensure iCloud Keychain / a password manager already has the passwords you need. Do this on every device that will change accounts.',
        keepCopyWarning: true,
      },
      ...risky.map((d) => ({
        id: `backup:${d.id}`,
        deviceId: d.id,
        title: `Backup checklist — ${d.name}`,
        body:
          d.platform === 'macOS'
            ? `On ${d.name}: export Contacts, confirm Calendar accounts in Calendar → Settings, and open Passwords to verify Keychain entries exist.`
            : `On ${d.name}: Settings → Contacts / Calendar accounts, export if needed, and open Passwords. Confirm pairing for any Apple Watch first.`,
        keepCopyWarning: true,
      })),
    ],
  };

  const mumDevices = devices.filter((d) => d.owner === 'Mum' && d.platform !== 'watchOS');
  const dadDevices = devices.filter((d) => d.owner === 'Dad' && d.platform !== 'watchOS');
  const watches = devices.filter((d) => d.platform === 'watchOS');
  const shared = devices.filter((d) => d.owner === 'Shared');

  const phase3Steps = [
    ...watches.map((d) => ({
      id: `watch:${d.id}`,
      deviceId: d.id,
      title: `Watch first — ${d.name}`,
      body: `Confirm ${d.name} pairing (${d.watchPaired || 'unknown'}) via the Watch app → General → About. Do not sign the paired iPhone out until this is verified.`,
    })),
    ...mumDevices.map((d) => ({
      id: `migrate-mum:${d.id}`,
      deviceId: d.id,
      title: `Mum migration — ${d.name}`,
      body: `After KEEP A COPY: sign ${d.name} into Mum’s intended personal Apple ID for iCloud, then set Media & Purchases / Family Sharing as planned. Re-check Messages → Send & Receive.`,
    })),
    ...dadDevices.map((d) => ({
      id: `migrate-dad:${d.id}`,
      deviceId: d.id,
      title: `Dad migration — ${d.name}`,
      body: `After KEEP A COPY: sign ${d.name} into Dad’s intended personal Apple ID for iCloud, then set Media & Purchases / Family Sharing as planned. Re-check Messages → Send & Receive.`,
    })),
    ...shared.map((d) => ({
      id: `shared:${d.id}`,
      deviceId: d.id,
      title: `Shared device — ${d.name}`,
      body: `Decide a single owner account for ${d.name}, or keep it as a kiosk with Family Sharing purchases only. Document the choice in the matrix.`,
    })),
    ...flags
      .filter((f) => f.severity === 'conflict')
      .map((f) => ({
        id: `resolve:${f.id}`,
        title: `Resolve: ${f.title}`,
        body: f.detail,
      })),
  ];

  const phase3: RunbookPhase = {
    id: 'phase-3-migrate',
    title: 'Phase 3 — Untangle accounts device by device',
    summary: 'Watches first, then phones/tablets/Macs. One device at a time.',
    steps: phase3Steps,
  };

  return {
    version: 1,
    createdAt: now,
    devices,
    phases: [phase1, phase2, phase3],
    flags,
  };
}
