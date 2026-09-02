# Project-AE
JustBored v2.0

## Progression Formula References

These Markdown files document and validate the XP progression system used by
the leveling cog:

- [`formulas.md`](formulas.md) defines the level and RNK formulas, lists
  alternative progression curves, and explains how XP thresholds relate to
  the progress display. The active base curve is linear:
  `G_n = 180 + (n - 1) * 255`.
- [`init_out.md`](init_out.md) is a generated comparison table for the
  initial level-curve candidates across Levels 1 through 100. It is useful
  for comparing the current linear curve with multiplicative, percentage,
  quadratic, cubic, logarithmic, power-law, and other alternatives.
- [`rnk.md`](rnk.md) contains reference tables showing how different RNK
  scaling models change the XP requirement for each level. It is design and
  comparison documentation; it is not read by the bot at runtime.

The active implementation is in
`Jahoda/disc/cogs/levelsys/modules/level.py`. It uses exponential scaling of
the entire level requirement by RNK: `2^r * G_n`, with RNK represented as a
zero-based internal value.
