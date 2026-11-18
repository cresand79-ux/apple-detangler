import type { DeviceCI, DeviceType, Platform } from '../types';

function blankAnswers(
  partial: Pick<DeviceCI, 'id' | 'name' | 'owner' | 'platform' | 'kind'> &
    Partial<Pick<DeviceCI, 'isCustom' | 'checked'>>,
): DeviceCI {
  return {
    deviceNameSeen: '',
    softwareVersion: '',
    primaryAppleId: '',
    devicesOnAccount: [],
    otherDevicesOnAccount: '',
    mediaPurchases: '',
    messagesFaceTime: '',
    contactsIcloud: '',
    watchPaired: '',
    watchVersion: '',
    pairingVerifiedBeforeSignOut: '',
    checked: false,
    updatedAt: new Date(0).toISOString(),
    ...partial,
  };
}

export const PRESET_DEVICES: DeviceCI[] = [
  blankAnswers({
    id: 'mum-iphone',
    name: "Mum's iPhone",
    owner: 'Mum',
    platform: 'iOS',
    kind: 'iPhone',
  }),
  blankAnswers({
    id: 'mum-watch',
    name: "Mum's Apple Watch",
    owner: 'Mum',
    platform: 'watchOS',
    kind: 'Apple Watch',
  }),
  blankAnswers({
    id: 'mum-macbook',
    name: "Mum's MacBook Air",
    owner: 'Mum',
    platform: 'macOS',
    kind: 'Mac',
  }),
  blankAnswers({
    id: 'dad-imac',
    name: "Dad's iMac (Big Computer)",
    owner: 'Dad',
    platform: 'macOS',
    kind: 'Mac',
  }),
  blankAnswers({
    id: 'dad-ipad',
    name: "Dad's iPad",
    owner: 'Dad',
    platform: 'iPadOS',
    kind: 'iPad',
  }),
  blankAnswers({
    id: 'dad-iphone',
    name: "Dad's iPhone",
    owner: 'Dad',
    platform: 'iOS',
    kind: 'iPhone',
  }),
];

export function kindToPlatform(kind: DeviceType): Platform {
  switch (kind) {
    case 'iPhone':
      return 'iOS';
    case 'iPad':
      return 'iPadOS';
    case 'Mac':
      return 'macOS';
    case 'Apple Watch':
      return 'watchOS';
  }
}

export function createCustomDevice(): DeviceCI {
  return blankAnswers({
    id: crypto.randomUUID(),
    name: 'New Device',
    owner: 'Shared',
    platform: 'iPadOS',
    kind: 'iPad',
    isCustom: true,
  });
}

export function deviceSubtitle(device: DeviceCI): string {
  const version = device.softwareVersion.trim();
  if (version) return `${device.platform} ${version}`;
  return `${device.owner} · ${device.platform}`;
}
