---
id: theory-of-constraints
title: Theory of Constraints
sequence: 15
categories:
  - Foundations
  - Systems Thinking
summary: Every system has one binding constraint, and improvement anywhere else is close to worthless.
keywords:
  - bottleneck
  - throughput
  - capacity
  - flow
related:
  - systems-thinking
  - opportunity-cost
  - ooda-loop
publishedAt: 2026-08-03
status: published
---

## Principle

Output is set by the single tightest constraint. Improve that, or do not expect the
output to change.

## Explanation

In any system that produces something through a series of steps, one step limits the
whole. Effort spent making other steps faster produces work-in-progress, not
throughput, and often makes things worse by increasing queues in front of the
constraint.

This is unintuitive because local improvements look like progress. Every team can
demonstrate a gain in its own area while total output stays flat, and everyone is
telling the truth.

The sequence is: identify the constraint, get everything possible out of it, arrange
the rest of the system to keep it fed, then add capacity to it. And after that, find
the new constraint — because there always is one, and it has moved.

## Military Example

An air movement plan is limited not by aircraft but by the throughput of a single
loading ramp. Adding sorties increases the number of aircraft waiting. The gains come
from keeping the ramp working continuously: pre-palletised loads, crews positioned in
advance, no scheduled gap where the ramp sits idle. Only once the ramp never waits does
adding lift capacity change the number of tonnes moved.

## Leadership Example

A hiring process takes eleven weeks. Recruiters shorten screening from five days to
two, which changes nothing, because the constraint is the two-week wait for panel
availability. The fix is unglamorous: standing panel slots in the calendar, and a
second qualified panel member. Everyone else's efficiency work was real and irrelevant.

## Product Example

A team measures cycle time and finds work sits an average of six days waiting for code
review, against two days of active development. Hiring more engineers increases the
review queue. The interventions that matter are review as a scheduled obligation rather
than an interruption, smaller changes, and a second reviewer for the area with a single
qualified person.

## Questions

- Where does work actually wait, as opposed to where it is being worked on?
- If I doubled the capacity of this step, would total output change?
- Is the constraint being kept fully busy, or does it sit idle waiting for inputs?
- Where has the constraint moved since we last improved something?

## Common Misuse

The most frequent error is nominating the constraint by intuition instead of measuring
where work queues. The second is treating it as permanent: solve a constraint and it
moves, so a system optimised around last year's bottleneck slowly becomes
misconfigured. And the model assumes a definable flow — applied to genuinely creative
work, where the limit is judgement rather than capacity, it produces confident answers
about the wrong thing.
