---
id: expected-value
title: Expected Value
sequence: 3
categories:
  - Probability & Risk
summary: Judge a decision by the size of each outcome weighted by its likelihood, not by the outcome you got.
keywords:
  - probability
  - payoff
  - asymmetry
  - decisions
related:
  - base-rates
  - margin-of-safety
  - opportunity-cost
  - kelly-criterion
  - value-of-information
publishedAt: 2026-08-10
status: published
---

## Principle

Weigh each possible outcome by how likely it is, and judge the decision on the total —
not on which outcome happened to occur.

## Explanation

A good decision can produce a bad result, and a reckless one can pay off. Judging
decisions by outcomes rewards luck and teaches the wrong lesson, which is why the
quality of the process has to be assessed separately from what happened.

Expected value gives you that separation. List the outcomes, estimate the payoff and
rough likelihood of each, and add them up. The arithmetic is usually less important
than the exercise of writing the outcomes down at all — most poor decisions come from
never enumerating what could happen.

The part that matters most is asymmetry. A small chance of a very large gain, or a
small chance of an unrecoverable loss, dominates the calculation. Look for options
where the downside is capped and the upside is not, and refuse the reverse regardless
of how favourable the odds look.

## Military Example

A raid has a high probability of achieving a modest objective and a low probability of
losing an aircraft and crew. The expected-value question is not whether the raid will
probably succeed — it will. It is whether the objective is worth the weighted cost of
the tail outcome, which is not recoverable and not proportional. Many tactically
promising options fail this test, which is why the loss is assessed before the odds.

## Leadership Example

An executive weighs a reorganisation with a good chance of a moderate efficiency gain
against a smaller chance of losing several senior people whose knowledge is not
documented. Both branches must be priced. If the departure scenario costs more than
three years of the efficiency gain, the favourable odds do not rescue the decision.

## Product Example

A team can ship a safe feature with a near-certain small improvement, or attempt one
with a one-in-five chance of a step change and a four-in-five chance of two wasted
months. If the step change is worth twenty times the safe option, the second is the
better expected value even though it usually fails — provided the two months are
genuinely affordable and the team can take the bet repeatedly.

## Questions

- What are the outcomes, and roughly how likely is each?
- Is the downside recoverable, or does one branch end the game?
- Would I take this bet a hundred times? Do I get to?
- Am I judging this decision by its process or by the result I already know?

## Common Misuse

The arithmetic invites false precision: multiplying two guesses produces a number that
looks authoritative and is not. Treat it as a way to rank options, not to value them.
The larger error is applying it to one-shot decisions with ruinous downside — expected
value assumes you play repeatedly, and a bet that is favourable on average but
occasionally fatal is not favourable to someone who only gets one attempt.
