---
id: inversion
title: Inversion
sequence: 1
categories:
  - Foundations
summary: Work backwards from failure — describe how the plan fails, then remove those causes.
keywords:
  - failure
  - premortem
  - avoidance
  - planning
related:
  - second-order-thinking
  - margin-of-safety
  - chestertons-fence
publishedAt: 2026-08-03
status: published
---

## Principle

Instead of asking how to succeed, ask what would guarantee failure — then avoid that.

## Explanation

Forward planning has a bias built into it. You imagine the outcome you want, then
assemble the steps that lead there, and the plan inherits your optimism at every step.

Inversion attacks the same problem from the other end. State the failure explicitly:
"It is twelve months from now and this has gone badly. What happened?" The answers
arrive faster and more honestly than a list of success factors, because failure modes
are concrete while success factors are abstract.

The practical value is that avoiding failure is usually more tractable than engineering
success. You rarely control whether something wins. You almost always control whether
it collapses for a reason you could have named in advance.

## Military Example

Planning staff run a course-of-action analysis by assigning a team to argue the enemy's
side. Rather than refining the preferred plan, that team is asked how they would defeat
it: interdict the single supply route, strike during the relief in place, exploit the
gap between two units' boundaries. Each answer becomes a requirement — a second route,
a change to the relief timing, a liaison at the boundary. The plan is not improved by
adding strengths, but by closing the ways it dies.

## Leadership Example

Before a restructure, an executive asks the leadership team to write the failure story
in advance: the best engineers leave, customers hear about it from a competitor first,
and middle managers cannot answer the questions their teams ask. Three specific risks
surface that no "what does success look like" session had produced — because success
was described as "a leaner, more focused organisation", which is not actionable.

## Product Example

A team about to build an integration lists what would make it worthless: the partner
changes their API without notice, only four customers ever enable it, and support
cannot diagnose failures without engineering. That list reframes the work. Versioning
and a diagnostic log move into scope. The team also decides to confirm demand with ten
customers first, which is cheaper than the integration itself.

## Questions

- If this fails badly, what is the most likely single cause?
- What would someone deliberately trying to sabotage this do first?
- Which of those failure modes can be removed cheaply, right now?
- Am I avoiding this question because the answer is inconvenient?

## Common Misuse

Inversion is a planning tool, not a temperament. Used constantly it becomes a licence
for pessimism and a reason never to commit, and teams that only ever run premortems
stop shipping. It also has a blind spot: avoiding failure does not by itself produce a
strong position. You still need a thesis about why this succeeds. Invert to harden the
plan, then return to building it.
