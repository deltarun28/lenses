---
id: margin-of-safety
title: Margin of Safety
sequence: 13
categories:
  - Foundations
  - Probability & Risk
summary: Build for conditions worse than you expect, because your estimate of the worst case is also an estimate.
keywords:
  - buffer
  - risk
  - resilience
  - estimation
related:
  - inversion
  - bayesian-thinking
  - opportunity-cost
  - error-budgets
publishedAt: 2026-08-03
status: published
---

## Principle

Leave a gap between what you can survive and what you expect to face.

## Explanation

Engineers do not build a bridge to hold the heaviest expected load. They build it to
hold several times that, because materials vary, loads are estimated, and the
consequence of being wrong is not proportional to the size of the error.

The same asymmetry appears in plans, budgets and schedules. Your estimate of the worst
case is itself an estimate, produced by the same process that produced the central
estimate, and subject to the same optimism. A margin is protection against the error in
your error estimate.

Margin is not free. It is capital not deployed, capacity not used, time not filled. The
judgement is where the consequence of failure is non-linear — where being slightly
wrong is recoverable but being badly wrong ends the operation. Those are the places
that get margin.

## Military Example

Fuel planning does not carry the calculated requirement. It carries the requirement
plus a reserve, because route changes, contact, and idling all consume fuel that the
plan did not, and a vehicle that runs dry is not merely late — it becomes a static
target and a recovery task. The reserve is expensive in lift capacity. It is carried
anyway because the failure is not proportional to the shortfall.

## Leadership Example

A leader planning a major change builds the timeline on the assumption that two key
people will be unavailable for part of it, that the first attempt at communication will
be misread, and that one dependency will slip. The plan is longer and less impressive
than the version without margin. It is also the one that survives contact with an
organisation where people take leave and messages land badly.

## Product Example

A team sizes infrastructure for three times observed peak traffic, not for peak. The
extra capacity is visible waste on a monthly bill. It is bought because the failure
mode is not gradual — degradation under load costs sign-ups, support time and trust in
a single afternoon, and the recovery takes far longer than the incident.

## Questions

- What happens if I am wrong by a factor of two, not ten per cent?
- Is the failure here proportional to the error, or does it fall off a cliff?
- What is this margin costing, and is that price worth paying here?
- Whose estimate am I relying on, and what is their track record?

## Common Misuse

Margin gets applied uniformly, which is the expensive mistake — buffering everything
equally wastes resource on failures that were always recoverable. It also becomes cover
for padding: an estimate inflated privately is not a margin, because nobody can see it
or decide about it, and it corrupts every plan built on top. State margins explicitly.
And a margin large enough to guarantee safety usually means you have declined to take
the position at all.
