/**
 * Content collections.
 *
 * All published prose lives in `src/content/pages/{en,es}/*.yaml` — one file per
 * page per language, sharing a single schema. Founders edit those files; they
 * never touch a component.
 *
 * YAML rather than Markdown because these pages are structured (hero, sections,
 * items) rather than long-form articles. A schema violation is then a build
 * error with a line number, instead of a section silently vanishing.
 *
 * The English/Spanish parity rule is enforced in `src/copy.ts`, which runs at
 * build time — see the note there.
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Imported directly rather than re-exported from `astro:content`, which Astro 7
// deprecates. Zod arrives as an Astro dependency, so this adds nothing to the tree.
import { z } from 'zod';

/** A call to action. `href` is an unprefixed path; the locale is added later. */
const cta = z.object({
  label: z.string(),
  href: z.string(),
  /** Renders as the primary (garden) button. At most one per group. */
  primary: z.boolean().optional(),
  /** Leaves the site — opens in a new tab with the right rel. */
  external: z.boolean().optional(),
});

/** A repeated item inside a section: a step, a deliverable, a founder, an FAQ. */
const item = z.object({
  /** Icon name from src/icons. Validated at render, not here. */
  icon: z.string().optional(),
  title: z.string(),
  body: z.string().optional(),
  /** Attribution for a cited number. Must map to an entry in docs/SOURCES.md. */
  source: z.string().optional(),
  sourceHref: z.url().optional(),
  /** For stat items. */
  value: z.string().optional(),
});

const section = z.object({
  /** Anchor id. Also how a component finds the section it renders. */
  id: z.string(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  /** One or more paragraphs. An array so a translator cannot merge them. */
  body: z.array(z.string()).optional(),
  items: z.array(item).optional(),
  ctas: z.array(cta).optional(),
  /** Shown in a quieter, smaller style — clinic notes, caveats, pending flags. */
  note: z.string().optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: z.object({
    /**
     * Meta title, WITHOUT the org name — Base.astro appends it. Kept short so
     * the whole thing survives a search result.
     */
    title: z.string().min(3).max(60),
    /** Meta description. Google truncates past ~160 characters. */
    description: z.string().min(50).max(165),
    hero: z
      .object({
        eyebrow: z.string().optional(),
        title: z.string(),
        lead: z.string().optional(),
        ctas: z.array(cta).optional(),
      })
      .optional(),
    sections: z.array(section).default([]),
  }),
});

export const collections = { pages };
