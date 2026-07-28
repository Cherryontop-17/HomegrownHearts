# Delivery updates

One Markdown file per delivery, named `YYYY-MM-DD-something.md`. They appear on
/impact, newest first. Files starting with `_` (like this one) are ignored.

```markdown
---
title: First delivery of the season
date: 2026-08-14
locale: en
bundles: 12
---

Twelve bundles went out this morning — mostly tomatoes, squash, and basil.
We learned that paper bags do not like wet greens.
```

`title` and `date` are required. `bundles` is optional and does **not** update
the totals on the site — those live in `src/config.ts` and are still changed by
hand, so the two can be compared and a mistake in either shows up.

Write updates in whichever language you wrote them in and set `locale`
accordingly. Unlike the page copy, updates are not required to exist in both
languages: an update is a real event with a date, and forcing a translation of
every one would either block you from publishing or produce machine translation
nobody has read.

Nothing here may name, describe, or photograph a recipient. See
[COMPLIANCE.md](../../../docs/COMPLIANCE.md) Rule 3.
