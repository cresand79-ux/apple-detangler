export type View = 'hub' | 'inspector' | 'matrix' | 'runbook';

export type Owner = 'Mum' | 'Dad' | 'Shared';

export type DeviceType = 'iPhone' | 'iPad' | 'Mac' | 'Apple Watch';

export type Platform = 'iOS' | 'iPadOS' | 'macOS' | 'watchOS';

export type MessagesChoice =
  | ''
  | 'Shared family email'
  | 'Personal email'
  | 'Phone number only'
  | 'Not sure';

export type YesNoUnsure = '' | 'Yes — switched on' | 'No — switched off' | 'Not sure';

export type PairingChoice =
  | ''
  | 'Yes — paired to Mum’s iPhone'
  | 'Yes — paired to Dad’s iPhone'
  | 'Not paired / unknown';

/** Configuration Item — one household Apple device passport. */
export type DeviceCI = {
  id: string;
  name: string;
  owner: Owner;
  platform: Platform;
  kind: DeviceType;
  isCustom?: boolean;
  /** Inspector answers — never passwords */
  deviceNameSeen: string;
  softwareVersion: string;
  primaryAppleId: string;
  /** Household device ids that appear under this Apple Account’s Devices list */
  devicesOnAccount: string[];
  /** Names of other / unrecognised devices listed on the account */
  otherDevicesOnAccount: string;
  mediaPurchases: string;
  messagesFaceTime: MessagesChoice;
  contactsIcloud: YesNoUnsure;
  /** watchOS-only — which iPhone’s Watch app shows this watch */
  watchPaired: PairingChoice;
  watchVersion: string;
  /** @deprecated kept for older saved answers; pairing is captured via watchPaired */
  pairingVerifiedBeforeSignOut: YesNoUnsure;
  /** Marked when user finishes a check */
  checked: boolean;
  updatedAt: string;
};

export type ConflictSeverity = 'conflict' | 'review' | 'clear';

export type ConflictFlag = {
  id: string;
  severity: ConflictSeverity;
  title: string;
  detail: string;
  deviceIds: string[];
};

export type RunbookPhase = {
  id: string;
  title: string;
  summary: string;
  steps: RunbookStep[];
};

export type RunbookStep = {
  id: string;
  deviceId?: string;
  title: string;
  body: string;
  keepCopyWarning?: boolean;
  done?: boolean;
};

export type MasterPlan = {
  version: 1;
  createdAt: string;
  devices: DeviceCI[];
  phases: RunbookPhase[];
  flags: ConflictFlag[];
};
