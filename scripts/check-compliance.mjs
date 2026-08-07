/**
 * Compliance linter — enforces docs/COMPLIANCE.md.
 *
 * Two founders are minors publishing about food and pregnancy. Rule 1 (no
 * health claims) and Rule 2 (not a 501(c)(3)) are the line between a student
 * food project and unlicensed medical advice plus charity misrepresentation.
 * Those rules cannot depend on everyone remembering them a year from now, so
 * the checkable parts run in CI.
 *
 * Scans all copy — content collections in both languages, the UI dictionary,
 * and page components — for banned constructions.
 *
 * This catches phrasing, not meaning. It cannot see a health claim made by
 * juxtaposition, or a Spanish register slip. The review checklist in
 * COMPLIANCE.md covers those, and a fluent speaker still has to read the
 * Spanish before launch.
 *
 * Run: npm run check:compliance
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative, extname } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Where published copy lives. Docs are excluded — they discuss the rules. */
const SCAN_DIRS = ['src/content', 'src/pages', 'src/components', 'src/i18n'];

const SCAN_EXTENSIONS = new Set(['.md', '.mdx', '.astro', '.ts', '.json', '.yaml', '.yml']);

/**
 * Health-claim verbs, only when they land near a body/food/pregnancy word.
 * Bare "helps" is fine ("helps us pack bundles"); "helps your pregnancy" is not.
 */
const SUBJECTS = String.raw`(?:pregnan\w*|mother\w*|bab\w*|fetal|fetus|health\w*|bod\w*|nutri\w*|immun\w*|embarazo\w*|madre\w*|beb[eé]\w*|salud\w*|cuerpo\w*|nutri\w*)`;

const CLAIM_VERBS = String.raw`(?:helps?|supports?|boosts?|improves?|prevents?|reduces?|promotes?|aids?|strengthens?|enhances?|heals?|cures?|treats?|protects?|ensures?|ayuda\w*|mejora\w*|previene\w*|fortalece\w*|favorece\w*|beneficia\w*|protege\w*)`;

/**
 * @typedef {{ id: string, rule: string, pattern: RegExp, why: string, allow?: RegExp }} Check
 */

/** @type {Check[]} */
const CHECKS = [
  // --- Rule 1: health claims ---------------------------------------------
  {
    id: 'claim-verb-near-subject',
    rule: 'Rule 1',
    // Verb within ~40 chars of a body/pregnancy word, in either order.
    pattern: new RegExp(`\\b${CLAIM_VERBS}\\b[^.!?]{0,40}\\b${SUBJECTS}\\b`, 'gi'),
    /*
      The partner clinic's own name is not a health claim.

      "HELP Pregnancy Center" trips this rule on every single mention — "help"
      is a claim verb, "pregnancy" is a subject, and in that name they are
      adjacent by definition — as does its URL slug. A proper noun is not a
      claim about a body, and a rule that stops the site naming its own partner
      is doing more harm than the thing it guards against.

      Scoped to the exact registered name and slug. It does NOT permit
      "helps pregnancy" or anything else of that shape.
    */
    allow: /HELP Pregnancy Center|help-pregnancy-center/i,
    why: 'Reads as a health claim. Describe the food, never its effects.',
  },
  {
    id: 'claim-verb-near-subject-reversed',
    rule: 'Rule 1',
    pattern: new RegExp(`\\b${SUBJECTS}\\b[^.!?]{0,40}\\b${CLAIM_VERBS}\\b`, 'gi'),
    // Same proper-noun exemption as above. See the note there.
    allow: /HELP Pregnancy Center|help-pregnancy-center/i,
    why: 'Reads as a health claim. Describe the food, never its effects.',
  },
  {
    id: 'health-claim-phrase',
    rule: 'Rule 1',
    pattern:
      /\b(healthy pregnanc\w*|healthy bab\w*|fetal development|birth outcomes?|essential for|vital for|good for you|nutrient[- ]rich|superfood\w*|doctor[- ]recommended|embarazo saludable|beb[eé] sano|desarrollo fetal|esencial para|vital para|nutritiv\w*)\b/gi,
    why: 'Named health-claim phrase. Cut it — there is no compliant rewrite.',
  },

  // --- Rule 2: status -----------------------------------------------------
  {
    id: 'implies-nonprofit-status',
    rule: 'Rule 2',
    /*
      `NGO` and `NonprofitType` are here because this rule used to check prose
      only, and a status claim does not have to be prose. The JSON-LD in
      Schema.astro carried `"@type": "NGO"` — schema.org's Non-governmental
      Organization, which Google reads as a charitable-organization signal —
      and it passed every run, because the list named `nonprofit` and `charity`
      and never NGO. A machine-readable claim is still a claim, and it is
      harder to spot precisely because nobody reads it.

      Case-insensitive like the rest of the list. The \b boundaries mean `NGO`
      only matches as a standalone word — never inside `mango` or `Congo`.
    */
    pattern:
      /\b(501\s*\(?c\)?\s*\(?3\)?|non-?profit|NonprofitType|NGO|charity|charitable|tax[- ]exempt|sin fines de lucro|sin [aá]nimo de lucro|organizaci[oó]n ben[eé]fica)\b/gi,
    // Stating that we are NOT one is the entire point of the required status
    // line, so a negated mention is compliant — the same exemption
    // `tax-deductible` needs.
    allow:
      /\b(not?[ -]a?\s?501|non-501|not a nonprofit|not a charity|no somos|sin ser|has no tax|no tiene exenci|sin exenci|no exenci)\b/i,
    why: 'Homegrown Hearts is an unincorporated student initiative. This implies a status it does not hold.',
  },
  {
    id: 'implies-deductible',
    rule: 'Rule 2',
    // Allowed only inside the explicit negation.
    pattern: /\btax[- ]deductible\b|\bdeducible de impuestos\b/gi,
    allow: /\b(not tax[- ]deductible|are not tax[- ]deductible|no son deducibles de impuestos)\b/i,
    why: 'Only permitted inside the explicit negation in the required status line.',
  },
  {
    id: 'solicits-money',
    rule: 'Rule 2',
    pattern:
      /\b(donate (?:money|cash|\$)|cash donation|venmo|paypal|gofundme|cashapp|zelle|monetary (?:gift|donation))\b/gi,
    why: 'We accept donated supplies only. No entity, no treasurer, no bank account.',
  },

  // --- Rule 5: unquantified claims ---------------------------------------
  {
    id: 'unquantified-impact',
    rule: 'Rule 5',
    pattern:
      /\b(hundreds of|dozens of|countless|thousands of|numerous families|many families|cientos de|docenas de|innumerables)\b/gi,
    why: 'If it cannot be counted from config.ts, it does not go on the site.',
  },
];

/**
 * Claims that must be PRESENT. A rule that only forbids things cannot notice
 * the required status line being deleted.
 */
const REQUIRED = [
  {
    id: 'status-line-en',
    file: 'src/i18n/ui.ts',
    pattern: /donations are not tax-deductible/i,
    why: 'The required non-501(c)(3) status line is missing from the English dictionary.',
  },
  {
    id: 'status-line-es',
    file: 'src/i18n/ui.ts',
    pattern: /no son deducibles de impuestos/i,
    why: 'The required non-501(c)(3) status line is missing from the Spanish dictionary.',
  },
  {
    id: 'privacy-line-en',
    file: 'src/i18n/ui.ts',
    pattern: /never collect, store, or publish/i,
    why: 'The required recipient-privacy statement is missing from the English dictionary.',
  },
  {
    id: 'privacy-line-es',
    file: 'src/i18n/ui.ts',
    pattern: /Nunca recopilamos/i,
    why: 'The required recipient-privacy statement is missing from the Spanish dictionary.',
  },
];

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (SCAN_EXTENSIONS.has(extname(entry))) out.push(full);
  }
  return out;
}

/** Line number for a character offset, for a clickable location. */
function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

/**
 * Blanks out comments before scanning, preserving line numbers.
 *
 * A comment is not published, so it cannot violate a publishing rule — and the
 * files that most need commenting are exactly the ones documenting which
 * phrases are banned, which means they quote them. Without this, the copy files
 * that take compliance most seriously are the ones that fail the check, and a
 * gate that cries wolf is a gate people learn to ignore.
 *
 * Markdown is left alone: all of it is published.
 */
function stripComments(text, ext) {
  if (ext === '.md' || ext === '.mdx') return text;

  if (ext === '.yaml' || ext === '.yml') {
    // Only whole-line comments. A `#` mid-line could be inside a quoted string,
    // and guessing wrong would hide real copy from the scan.
    return text
      .split('\n')
      .map((line) => (/^\s*#/.test(line) ? '' : line))
      .join('\n');
  }

  // JS / TS / Astro. Block comments first, keeping their newlines so line
  // numbers still point at the right place.
  let out = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  // Line comments, but not the `//` in `https://`.
  out = out.replace(/(^|[^:/])\/\/[^\n]*/g, (_m, prefix) => prefix);
  return out;
}

let failures = 0;
let scanned = 0;

for (const dir of SCAN_DIRS) {
  for (const file of walk(resolve(ROOT, dir))) {
    const raw = readFileSync(file, 'utf8');
    const text = stripComments(raw, extname(file));
    scanned++;

    for (const check of CHECKS) {
      // Fresh lastIndex per file — these are /g regexes.
      check.pattern.lastIndex = 0;
      let match;
      while ((match = check.pattern.exec(text)) !== null) {
        const snippet = match[0].replace(/\s+/g, ' ').trim();

        // A permitted context, e.g. "not tax-deductible".
        if (check.allow) {
          const from = Math.max(0, match.index - 60);
          // Whitespace-normalized: YAML folded scalars wrap mid-phrase, so
          // "has no\n  tax-exempt" must still match an allow pattern written
          // as "has no tax".
          const window = text.slice(from, match.index + match[0].length + 20).replace(/\s+/g, ' ');
          if (check.allow.test(window)) continue;
        }

        // Compliance docs quote the banned forms in order to ban them.
        if (/COMPLIANCE|check-compliance/.test(file)) continue;

        failures++;
        console.error(`  ${check.rule}  ${relative(ROOT, file)}:${lineOf(text, match.index)}`);
        console.error(`            "${snippet}"`);
        console.error(`            ${check.why}\n`);
      }
    }
  }
}

for (const req of REQUIRED) {
  const path = resolve(ROOT, req.file);
  const text = existsSync(path) ? readFileSync(path, 'utf8') : '';
  if (!req.pattern.test(text)) {
    failures++;
    console.error(`  MISSING   ${req.file}`);
    console.error(`            ${req.why}\n`);
  }
}

if (failures > 0) {
  console.error(`${failures} compliance violation(s) across ${scanned} file(s).`);
  console.error('Read docs/COMPLIANCE.md. These rules are not style preferences.');
  process.exit(1);
}

console.log(
  `  ${scanned} files scanned, ${CHECKS.length} rules, ${REQUIRED.length} required statements.`,
);
console.log('No compliance violations.');
