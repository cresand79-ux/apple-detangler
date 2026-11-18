import type { DeviceCI } from '../types';
import { parseMajorVersion } from './conflicts';

/**
 * Monterey (12) and earlier use System Preferences (icon grid + Apple ID pane).
 * Ventura (13)+ use System Settings (sidebar).
 * Dad's iMac is known Monterey-era when version isn't filled yet.
 */
export function usesLegacyMacSystemPreferences(device: DeviceCI): boolean {
  if (device.platform !== 'macOS') return false;
  const major = parseMajorVersion(device.softwareVersion);
  if (major != null) return major < 13;
  return device.id === 'dad-imac';
}
