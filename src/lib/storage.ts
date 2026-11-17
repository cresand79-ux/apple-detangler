import { PRESET_DEVICES } from '../data/presets';
import type { DeviceCI } from '../types';

const DEVICES_KEY = 'apple-detangler:devices:v1';
const SELECTED_KEY = 'apple-detangler:selected:v1';
const PLAN_DONE_KEY = 'apple-detangler:runbook-done:v1';

function isDeviceCI(value: unknown): value is DeviceCI {
  if (!value || typeof value !== 'object') return false;
  const d = value as DeviceCI;
  return typeof d.id === 'string' && typeof d.name === 'string';
}

export function loadDevices(): DeviceCI[] {
  try {
    const raw = localStorage.getItem(DEVICES_KEY);
    if (!raw) return structuredClone(PRESET_DEVICES);
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return structuredClone(PRESET_DEVICES);
    }
    const byId = new Map<string, DeviceCI>();
    for (const preset of PRESET_DEVICES) {
      byId.set(preset.id, { ...preset });
    }
    for (const item of parsed) {
      if (!isDeviceCI(item)) continue;
      const existing = byId.get(item.id);
      if (existing && !item.isCustom) {
        byId.set(item.id, { ...existing, ...item, isCustom: false });
      } else {
        byId.set(item.id, item);
      }
    }
    // Keep presets first in stable order, then customs
    const presetIds = new Set(PRESET_DEVICES.map((d) => d.id));
    const presets = PRESET_DEVICES.map((p) => byId.get(p.id)!);
    const customs = [...byId.values()].filter((d) => !presetIds.has(d.id));
    return [...presets, ...customs];
  } catch {
    return structuredClone(PRESET_DEVICES);
  }
}

export function saveDevices(devices: DeviceCI[]): void {
  localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
}

export function saveDevice(device: DeviceCI): void {
  const devices = loadDevices();
  const next = devices.map((d) => (d.id === device.id ? device : d));
  if (!next.some((d) => d.id === device.id)) next.push(device);
  saveDevices(next);
}

export function loadSelectedId(): string | null {
  return localStorage.getItem(SELECTED_KEY);
}

export function saveSelectedId(id: string | null): void {
  if (!id) localStorage.removeItem(SELECTED_KEY);
  else localStorage.setItem(SELECTED_KEY, id);
}

export function loadRunbookDone(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(PLAN_DONE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveRunbookDone(done: Record<string, boolean>): void {
  localStorage.setItem(PLAN_DONE_KEY, JSON.stringify(done));
}
