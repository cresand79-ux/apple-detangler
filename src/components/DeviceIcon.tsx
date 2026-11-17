import { Laptop, Monitor, Smartphone, Tablet, Watch } from 'lucide-react';
import type { DeviceType } from '../types';

export function DeviceIcon({
  kind,
  size = 24,
  className = '',
}: {
  kind: DeviceType;
  size?: number;
  className?: string;
}) {
  const props = { size, className, 'aria-hidden': true as const };
  switch (kind) {
    case 'iPhone':
      return <Smartphone {...props} />;
    case 'iPad':
      return <Tablet {...props} />;
    case 'Mac':
      return kindMacHeuristic(size, className);
    case 'Apple Watch':
      return <Watch {...props} />;
  }
}

function kindMacHeuristic(size: number, className: string) {
  // Default Mac icon is Laptop; Matrix/Hub pass name context via kind only.
  return <Laptop aria-hidden className={className} size={size} />;
}

export function DeviceIconForName({
  kind,
  name,
  size = 24,
  className = '',
}: {
  kind: DeviceType;
  name: string;
  size?: number;
  className?: string;
}) {
  if (kind === 'Mac' && /imac/i.test(name)) {
    return <Monitor aria-hidden className={className} size={size} />;
  }
  return <DeviceIcon className={className} kind={kind} size={size} />;
}
