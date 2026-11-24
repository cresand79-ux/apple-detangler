export type Owner = 'dad' | 'mum' | 'shared' | 'danger';
export type DeviceKind = 'phone' | 'pad' | 'mac' | 'watch';

export type Ui =
  | 'prepChecklist'
  | 'contactsOpen'
  | 'contactsLists'
  | 'contactsExportHold'
  | 'contactsExportFields'
  | 'contactsExportShare'
  | 'isolate'
  | 'home'
  | 'settingsRoot'
  | 'appleAccount'
  | 'signOutChoice'
  | 'keepCopy'
  | 'passcode'
  | 'signOutConfirm'
  | 'signIn'
  | '2fa'
  | 'icloudContacts'
  | 'mediaPurchases'
  | 'messages'
  | 'success'
  | 'passwordsHome'
  | 'newSharedGroup'
  | 'addPeople'
  | 'movePasswords'
  | 'groupInvite'
  | 'autofill'
  | 'signInSecurity'
  | 'recoveryContacts'
  | 'legacyContact'
  | 'forbidden'
  | 'later';

export type Panel = {
  id: string;
  card: string;
  section: number;
  eyebrow: string;
  deviceLabel: string;
  osLabel: string;
  appleAccountHint?: string;
  /** Shown on Messages Send & Receive steps */
  messagesPhoneHint?: string;
  messagesEmailHint?: string;
  path?: string;
  tapTarget?: string;
  ui: Ui;
  title: string;
  caption: string;
  owner: Owner;
  device: DeviceKind;
  warning?: string;
  /** Intro / briefing cards — not a fake device Settings screen */
  presentation?: 'intro' | 'device';
};

export const SECTION_NAMES = [
  'Dad’s iPad',
  'Dad’s iPhone',
  'Shared Passwords',
  'Recovery / Legacy',
  'Later',
] as const;
