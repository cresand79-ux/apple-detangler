import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { DeviceCI, MasterPlan } from '../types';

export function encodeCi(device: DeviceCI): string {
  return compressToEncodedURIComponent(JSON.stringify(device));
}

export function decodeCi(payload: string): DeviceCI | null {
  try {
    const json = decompressFromEncodedURIComponent(payload);
    if (!json) return null;
    const parsed = JSON.parse(json) as DeviceCI;
    if (!parsed?.id || !parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Full household snapshot for parents → Andrew share links. */
export function encodeHousehold(devices: DeviceCI[]): string {
  return compressToEncodedURIComponent(JSON.stringify(devices));
}

export function decodeHousehold(payload: string): DeviceCI[] | null {
  try {
    const json = decompressFromEncodedURIComponent(payload);
    if (!json) return null;
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const devices = parsed.filter(
      (d): d is DeviceCI =>
        !!d && typeof d === 'object' && typeof (d as DeviceCI).id === 'string' && typeof (d as DeviceCI).name === 'string',
    );
    return devices.length ? devices : null;
  } catch {
    return null;
  }
}

/** Share URL that opens Andrew’s planner and imports all device answers. */
export function buildHouseholdShareUrl(devices: DeviceCI[]): string {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/?$/, '/');
  return `${base}matrix#household=${encodeHousehold(devices)}`;
}

const ANDREW_EMAIL = 'andy.cresswell@outlook.com';
const SHARE_SUBJECT = 'apple untangler';

/** Open a mailto to Andrew with the share URL in the body (falls back if the link is too long). */
export async function emailHouseholdToAndrew(devices: DeviceCI[]): Promise<'mailed' | 'copied-mailed' | 'failed'> {
  const shareUrl = buildHouseholdShareUrl(devices);
  const fullBody = `Hi Andrew,\n\nHere are the Apple Account check results from this computer:\n\n${shareUrl}\n`;
  const fullMailto = `mailto:${ANDREW_EMAIL}?subject=${encodeURIComponent(SHARE_SUBJECT)}&body=${encodeURIComponent(fullBody)}`;

  // Many mail apps truncate very long mailto URLs; keep a safe budget.
  if (fullMailto.length <= 1800) {
    window.location.href = fullMailto;
    return 'mailed';
  }

  const copied = await copyText(shareUrl);
  if (!copied) return 'failed';
  const shortBody =
    'Hi Andrew,\n\nThe results link was too long for email automatically — please paste it from the clipboard (we copied it for you).\n';
  window.location.href = `mailto:${ANDREW_EMAIL}?subject=${encodeURIComponent(SHARE_SUBJECT)}&body=${encodeURIComponent(shortBody)}`;
  return 'copied-mailed';
}

export function encodePlan(plan: MasterPlan): string {
  return compressToEncodedURIComponent(JSON.stringify(plan));
}

export function decodePlan(payload: string): MasterPlan | null {
  try {
    const json = decompressFromEncodedURIComponent(payload);
    if (!json) return null;
    const parsed = JSON.parse(json) as MasterPlan;
    if (!parsed?.devices || !Array.isArray(parsed.devices)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function buildShareUrl(fragment: string): string {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`;
  return `${base.replace(/\/?$/, '/')}${fragment}`;
}

export function parseHash():
  | { kind: 'ci'; payload: string }
  | { kind: 'plan'; payload: string }
  | { kind: 'household'; payload: string }
  | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('ci=')) return { kind: 'ci', payload: hash.slice(3) };
  if (hash.startsWith('plan=')) return { kind: 'plan', payload: hash.slice(5) };
  if (hash.startsWith('household=')) return { kind: 'household', payload: hash.slice(10) };
  return null;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
