import type { ConflictFlag, DeviceCI } from '../types';

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** Parse major OS version from strings like "17.5.1", "iOS 17.5", "macOS 14.5". */
export function parseMajorVersion(raw: string): number | null {
  if (!raw.trim()) return null;
  const match = raw.match(/(\d{1,2})(?:\.\d+)*/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

export function isLegacyOs(device: DeviceCI): boolean {
  const major = parseMajorVersion(device.softwareVersion);
  if (major == null) return false;
  if (device.platform === 'iOS' || device.platform === 'iPadOS') return major < 17;
  if (device.platform === 'macOS') return major < 14;
  return false;
}

export function analyzeConflicts(devices: DeviceCI[]): ConflictFlag[] {
  const flags: ConflictFlag[] = [];
  const filled = devices.filter((d) => d.primaryAppleId.trim() || d.checked);

  // Shared primary Apple IDs across Mum and Dad
  const byPrimary = new Map<string, DeviceCI[]>();
  for (const d of filled) {
    const email = normalizeEmail(d.primaryAppleId);
    if (!email || email === 'paired to iphone' || email.includes('paired')) continue;
    const list = byPrimary.get(email) ?? [];
    list.push(d);
    byPrimary.set(email, list);
  }
  for (const [email, list] of byPrimary) {
    const owners = new Set(list.map((d) => d.owner).filter((o) => o === 'Mum' || o === 'Dad'));
    if (owners.has('Mum') && owners.has('Dad')) {
      flags.push({
        id: `shared-primary:${email}`,
        severity: 'conflict',
        title: 'Shared primary Apple ID across Mum and Dad',
        detail: `${email} appears as the primary account on devices for both Mum and Dad.`,
        deviceIds: list.map((d) => d.id),
      });
    } else if (list.length > 1 && list.some((d) => d.owner === 'Shared')) {
      flags.push({
        id: `shared-device-primary:${email}`,
        severity: 'review',
        title: 'Shared device uses a household Apple ID',
        detail: `${email} is the primary on a shared device — confirm who should own it long-term.`,
        deviceIds: list.map((d) => d.id),
      });
    }
  }

  // Cross-wired iMessage / FaceTime
  for (const d of filled) {
    if (!d.messagesFaceTime || d.messagesFaceTime === 'Not sure') continue;
    if (d.owner === 'Mum' && d.messagesFaceTime === 'Shared family email') {
      flags.push({
        id: `imessage-cross:${d.id}`,
        severity: 'review',
        title: 'iMessage may be cross-wired',
        detail: `${d.name} (Mum) lists Messages/FaceTime as a shared family email — check Send & Receive.`,
        deviceIds: [d.id],
      });
    }
    if (d.owner === 'Dad' && d.messagesFaceTime === 'Shared family email') {
      flags.push({
        id: `imessage-cross:${d.id}`,
        severity: 'review',
        title: 'iMessage may be cross-wired',
        detail: `${d.name} (Dad) lists Messages/FaceTime as a shared family email — check Send & Receive.`,
        deviceIds: [d.id],
      });
    }
  }

  // Also flag when media purchases differ from primary on personal devices
  for (const d of filled) {
    const primary = normalizeEmail(d.primaryAppleId);
    const media = normalizeEmail(d.mediaPurchases);
    if (primary && media && primary !== media && (d.owner === 'Mum' || d.owner === 'Dad')) {
      flags.push({
        id: `media-mismatch:${d.id}`,
        severity: 'review',
        title: 'Purchases use a different account',
        detail: `${d.name}: Media & Purchases (${d.mediaPurchases}) differs from primary (${d.primaryAppleId}).`,
        deviceIds: [d.id],
      });
    }
  }

  // Legacy OS lacking Shared Password Groups
  for (const d of devices) {
    if (!isLegacyOs(d)) continue;
    flags.push({
      id: `legacy-os:${d.id}`,
      severity: 'conflict',
      title: 'Legacy OS — no Shared Password Groups',
      detail: `${d.name} reports ${d.softwareVersion || d.platform}. Shared Password Groups need iOS/iPadOS 17+ or macOS 14+. Plan an update before migrating Keychain.`,
      deviceIds: [d.id],
    });
  }

  // Watch pairing reminders
  for (const d of devices) {
    if (d.platform !== 'watchOS') continue;
    if (!d.watchPaired || d.watchPaired.startsWith('Not paired')) {
      flags.push({
        id: `watch-pair:${d.id}`,
        severity: 'review',
        title: 'Apple Watch pairing needs confirmation',
        detail: `${d.name}: confirm which iPhone it is paired to before any Apple ID sign-out on that phone.`,
        deviceIds: [d.id],
      });
    } else if (d.pairingVerifiedBeforeSignOut !== 'Yes — switched on') {
      flags.push({
        id: `watch-verify:${d.id}`,
        severity: 'review',
        title: 'Verify watch pairing before iPhone sign-out',
        detail: `${d.name}: re-check pairing in the Watch app before signing the primary iPhone out of Apple ID.`,
        deviceIds: [d.id],
      });
    }
  }

  return flags;
}

export function statusForDevice(
  device: DeviceCI,
  flags: ConflictFlag[],
): 'conflict' | 'review' | 'clear' {
  const related = flags.filter((f) => f.deviceIds.includes(device.id));
  if (related.some((f) => f.severity === 'conflict')) return 'conflict';
  if (related.some((f) => f.severity === 'review')) return 'review';
  if (!device.checked && !device.primaryAppleId.trim()) return 'review';
  return 'clear';
}
