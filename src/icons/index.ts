/**
 * The icon registry: Lucide's set plus our own, behind one name space.
 *
 * Callers never need to know which is which, and a name that exists in neither
 * is a compile error rather than an empty square at runtime.
 */

import { LUCIDE_ICONS, type LucideIconName } from './lucide.generated';
import { CUSTOM_ICONS, type CustomIconName } from './custom';

export const ICONS = { ...LUCIDE_ICONS, ...CUSTOM_ICONS } as const;

export type IconName = LucideIconName | CustomIconName;

export { LUCIDE_ICONS, CUSTOM_ICONS };
export type { LucideIconName, CustomIconName };
