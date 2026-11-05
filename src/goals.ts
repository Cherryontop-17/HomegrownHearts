/**
 * Season targets, each paired with the live actual it is measured against.
 *
 * ⚠️ COMPLIANCE Rule 5. A target may not be published without its actual beside
 * it, and this is the only place the pairing is built. It lives in its own
 * module rather than inside a page component because two pages now show these
 * numbers — the homepage and /impact — and two hand-built copies would drift,
 * with the likely drift being a goal that quietly loses its actual.
 *
 * <GoalMeter> takes both from the same required field, so it is not possible to
 * render one of these without the other.
 */

import { IMPACT, GOALS } from './config';
import type { IconName } from './icons';
import type { UIKey } from './i18n/ui';

export interface SeasonGoal {
  icon: IconName;
  target: number;
  suffix?: string;
  label: string;
  actual: number;
  actualLabel: string;
}

/**
 * @param t Translation lookup from `useTranslations(locale)`.
 */
export function seasonGoals(t: (key: UIKey) => string): SeasonGoal[] {
  const soFar = (actual: number, target: number) =>
    t('goals.soFar').replace('{actual}', String(actual)).replace('{target}', String(target));

  return [
    {
      icon: 'basket',
      target: GOALS.produceLbs,
      suffix: '+',
      label: t('goals.produce'),
      // The first 11 bundles went out on 2026-11-04 without being weighed, so
      // the bar stays at 0 — but "0 of 250 so far" beside a delivery count
      // would read as "nothing grown", which is false. The label says why the
      // number is missing instead. When a harvest is weighed, add the running
      // total to IMPACT, read it here, and switch back to soFar().
      actual: 0,
      actualLabel: t('goals.notWeighed'),
    },
    {
      icon: 'package',
      target: GOALS.clinicBags,
      suffix: '+',
      label: t('goals.bags'),
      actual: IMPACT.bundlesDelivered,
      actualLabel: soFar(IMPACT.bundlesDelivered, GOALS.clinicBags),
    },
    {
      icon: 'sprout',
      target: GOALS.localPercent,
      suffix: '%',
      label: t('goals.local'),
      // A share, not a count. Until anything has been grown at all the honest
      // value is 0%, and `goals.notStarted` says why in words rather than
      // leaving a reader to interpret an empty bar.
      actual: 0,
      actualLabel: t('goals.notStarted'),
    },
  ];
}
