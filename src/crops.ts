/**
 * The crop database behind the planting calendar and the grow chart.
 *
 * ⚠️ READ THIS BEFORE ADDING A FIELD ────────────────────────────────────────
 *
 * This file describes HOW A PLANT GROWS and WHAT A KITCHEN DOES WITH IT.
 * It does not, and may never, describe what eating it does to a person.
 *
 * COMPLIANCE.md Rule 1 forbids health claims in our own voice, and it is
 * explicit that a citation does not launder one: "Poor nutrition in pregnancy
 * is linked to low birth weight" is banned *even with a source attached*.
 * A per-crop nutrient panel on a site whose audience is pregnant and
 * postpartum mothers is dietary advice written by two people who are not
 * clinicians, and it is the single fastest way to lose the clinic partnership.
 *
 * So there is no `nutrients` field, no `benefits` field, and no `bestFor`
 * field, and none may be added. The compliant way to point a reader at
 * nutrition information is the ACOG link-out that already exists in the page
 * copy — a referral, with no characterisation of our own.
 *
 * What IS allowed here, and is genuinely interesting to a reader:
 *   - days to maturity, sowing depth, spacing, sun and water needs
 *   - when to harvest and what the plant looks like when it is ready
 *   - how to keep it once it is picked, and plain ways to cook it
 *
 * ── Sourcing ──────────────────────────────────────────────────────────────
 * Every figure below is a horticultural fact and must be verifiable against
 * the cited source. `sourceKey` maps to an entry in docs/CROPS.md, which holds
 * the full citation and the verification status of each number.
 *
 * ⚠️ The day counts below are typical published ranges for USDA zone 7b/8a and
 * are marked UNVERIFIED in docs/CROPS.md. Before launch, each one must be
 * checked against the NC State Extension page for that crop and the status
 * flipped. Do not present them to a partner as sourced until that is done.
 */

import type { IconName } from './icons';

/** How the crop enters the ground. Drives which day count applies. */
export type PlantingMethod = 'seed' | 'transplant';

export interface Crop {
  id: string;
  icon: IconName;
  /**
   * Days from planting to first useful harvest, as a [min, max] range.
   * Which count applies depends on `method` — a basil transplant is weeks
   * ahead of basil from seed, and conflating the two is what makes a planting
   * schedule wrong.
   */
  daysToHarvest: [number, number];
  /** Seed or seedling. Set by what is on the supply wishlist. */
  method: PlantingMethod;
  /**
   * ISO date this crop goes in, inside the Aug 10-16 planting week.
   * Spread across the week so the calendar shows a real planting schedule
   * rather than everything landing on one day.
   */
  sownOn: string;
  /**
   * Pace group. Drives the colour band on the grow chart and is the whole
   * point of succession planting: fast crops carry the early deliveries while
   * the slow ones are still growing.
   */
  pace: 'fast' | 'medium' | 'slow';
  /** Citation key. Full reference in docs/CROPS.md. */
  sourceKey: string;
}

/**
 * Growing data.
 *
 * Ordered by sowing date, which is the order the calendar and the chart both
 * render them in.
 */
export const CROPS = [
  {
    id: 'basil',
    icon: 'flower-2',
    // From a nursery transplant. From seed it is 60-90 days, which would miss
    // the first delivery window entirely — this is why the wishlist asks for
    // plants rather than a seed packet.
    daysToHarvest: [21, 30],
    method: 'transplant',
    sownOn: '2026-08-10',
    pace: 'fast',
    sourceKey: 'ncsu-basil',
  },
  {
    id: 'kale',
    icon: 'leafy-green',
    // Baby leaf at the low end, full leaf at the high end. We cut at baby
    // stage for the first harvest and let the plant keep producing.
    daysToHarvest: [25, 65],
    method: 'seed',
    sownOn: '2026-08-10',
    pace: 'fast',
    sourceKey: 'ncsu-kale',
  },
  {
    id: 'lettuce',
    icon: 'salad',
    // Cut-and-come-again mesclun. The fastest thing in the ground.
    daysToHarvest: [21, 45],
    method: 'seed',
    sownOn: '2026-08-11',
    pace: 'fast',
    sourceKey: 'ncsu-lettuce',
  },
  {
    id: 'spinach',
    icon: 'leafy-green',
    // Cool-season. An August sowing in the Piedmont is at the hot edge of its
    // range; the reliable window is the fall succession round.
    daysToHarvest: [40, 50],
    method: 'seed',
    sownOn: '2026-08-11',
    pace: 'medium',
    sourceKey: 'ncsu-spinach',
  },
  {
    id: 'tomato',
    icon: 'sprout',
    method: 'transplant',
    daysToHarvest: [55, 70],
    sownOn: '2026-08-12',
    pace: 'slow',
    sourceKey: 'ncsu-tomato',
  },
  {
    id: 'carrot',
    icon: 'carrot',
    daysToHarvest: [60, 80],
    method: 'seed',
    sownOn: '2026-08-13',
    pace: 'slow',
    sourceKey: 'ncsu-carrot',
  },
  {
    id: 'cucumber',
    icon: 'sprout',
    daysToHarvest: [50, 70],
    method: 'seed',
    sownOn: '2026-08-14',
    pace: 'medium',
    sourceKey: 'ncsu-cucumber',
  },
] as const satisfies readonly Crop[];

export type CropId = (typeof CROPS)[number]['id'];

/** Midnight local, so a date-only ISO string is not shifted by the timezone. */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date: Date, days: number): Date {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

export interface CropSchedule {
  crop: Crop;
  sown: Date;
  /** First date anything can be picked. */
  harvestStart: Date;
  /** Date the crop is fully mature. */
  harvestEnd: Date;
}

/**
 * Sowing and harvest dates for every crop, derived rather than authored.
 *
 * This is what makes the grow chart honest: the harvest bars are computed from
 * real days-to-maturity, so if the schedule does not actually reach a delivery
 * date, the chart shows it instead of hiding it behind a tidy graphic.
 */
export const SCHEDULE: CropSchedule[] = CROPS.map((crop) => {
  const sown = parseISO(crop.sownOn);
  return {
    crop,
    sown,
    harvestStart: addDays(sown, crop.daysToHarvest[0]),
    harvestEnd: addDays(sown, crop.daysToHarvest[1]),
  };
});

/** Crops sown on a given ISO date. Drives the per-day markers in the calendar. */
export function cropsSownOn(iso: string): Crop[] {
  return CROPS.filter((c) => c.sownOn === iso);
}

/** The full span the chart has to cover, from first sowing to last maturity. */
export const SCHEDULE_RANGE = {
  start: SCHEDULE.reduce((a, s) => (s.sown < a ? s.sown : a), SCHEDULE[0].sown),
  end: SCHEDULE.reduce((a, s) => (s.harvestEnd > a ? s.harvestEnd : a), SCHEDULE[0].harvestEnd),
};
