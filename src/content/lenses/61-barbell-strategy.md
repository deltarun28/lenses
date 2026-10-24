---
id: barbell-strategy
title: Barbell Strategy
sequence: 61
categories:
  - Strategy
  - Probability & Risk
summary: Keep most of your exposure very safe and a small part in bets with capped losses and large possible gains — and distrust the comfortable middle.
keywords:
  - risk allocation
  - asymmetry
  - tail risk
  - taleb
related:
  - antifragility
  - kelly-criterion
  - optionality
  - margin-of-safety
publishedAt: 2026-10-25
status: published
---

## Principle

Put most of what you cannot afford to lose somewhere very safe, put a small part into
bets whose losses are capped and whose gains could be large, and be wary of exposure
that only looks moderate.

## Explanation

The image, popularised by Nassim Taleb, is a bar with weights at both ends and nothing
in the middle. One end is protected: it must survive whatever happens. The other end is
speculative but small, chosen so that each bet can lose only what was put in while the
possible gain is many times larger.

The case against the middle is the non-obvious part. "Medium-risk" exposures are often
described by their average behaviour and judged on it. Some of them hide a small chance
of a very large loss — a supplier that is cheap and reliable until it fails entirely, a
moderately leveraged position, a plan with no slack. They feel safer than the
speculative end and can be far more dangerous, because their downside is not capped.

Antifragility describes systems that gain from volatility; the barbell is one way of
arranging resources to approach it. It is a heuristic rather than a proven optimal
allocation, and it fits situations with two features: a downside that can actually be
capped, and an upside that is genuinely asymmetric. Where neither holds, ordinary
diversification or simple caution may be better.

## Military Example

A unit keeps its proven communications system as the primary means and runs a small,
isolated trial of a new radio network during training. The trial can fail without
affecting operations; if it succeeds, it earns a wider trial. What the unit avoids is
the middle path: partially replacing the proven system with a promising but untested
one, leaving it dependent on equipment that has never been under strain.

## Leadership Example

A business holds its operating reserve in cash and very low-risk instruments, enough to
survive a severe year without borrowing. Separately, it funds a few small exploratory
projects, each with a fixed budget and a review date. What it declines is a large
investment in a single "safe" expansion financed with debt, which would have looked
prudent in a normal year and threatened survival in a bad one.

## Product Example

A product team keeps the core purchase flow conservative: tested changes, slow rollout,
fast rollback. Alongside it, the team runs bold experiments in a separate area, open
only to users who opt in. The core funds the company; the experiments occasionally find
something worth moving into the core.

## Questions

- What must survive, whatever happens?
- Is my speculative exposure small enough that losing all of it is acceptable?
- Is each bet's loss really capped, or only expected to be small?
- Which "moderate" exposure has an uncapped downside I have not priced?

## Common Misuse

The barbell becomes a story told after the fact to justify a portfolio of gambles. The
speculative end only works if it is truly small and its losses truly capped; a "small
bet" that can trigger liabilities or reputational damage is not small. The safe end can
also hide correlated risk — several "safe" holdings that all depend on the same
condition. And not every situation offers asymmetric bets; forcing the shape onto one
that does not wastes the protected capital's potential.
