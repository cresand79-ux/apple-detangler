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
  | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('ci=')) return { kind: 'ci', payload: hash.slice(3) };
  if (hash.startsWith('plan=')) return { kind: 'plan', payload: hash.slice(5) };
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
