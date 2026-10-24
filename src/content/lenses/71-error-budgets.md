---
id: error-budgets
title: Error Budgets
sequence: 71
categories:
  - Systems Thinking
  - AI & Technology
summary: Decide in advance how much failure is acceptable, then spend that allowance deliberately — fast change while within it, stabilisation when it is spent.
keywords:
  - reliability
  - service level objectives
  - risk appetite
  - speed versus stability
related:
  - margin-of-safety
  - explore-exploit-tradeoff
  - goodharts-law
  - swiss-cheese-model
publishedAt: 2026-10-25
status: published
---

## Principle

Instead of demanding perfection, agree how much failure is acceptable, and treat the
unused allowance as something to spend.

## Explanation

The idea comes from Google's site reliability engineering practice. A service is given a
reliability objective below 100 per cent — say, 99.9 per cent of requests succeed over a
month. The remaining 0.1 per cent is the error budget. While the service is comfortably
within it, teams can release changes quickly and take risks. Once the budget is spent,
changes pause and effort goes into stability until it recovers.

What makes this useful is that it turns a recurring argument into a rule. Engineers who
want to ship and operators who want stability are both right, and without an agreed rule
each incident restarts the argument and the loudest voice wins. The budget makes the
trade-off explicit, decided once and in advance.

It also recognises a truth that applies well beyond software: perfect reliability is
usually impossibly expensive, and pursuing it reduces the ability to change. Every extra
decimal place of reliability costs more than the last. The right level is the point at
which the people affected stop noticing the failures, which is almost never zero.

The general form works anywhere an activity trades speed or ambition against occasional
failure. Agree what level of failure the people affected can genuinely tolerate, measure
it honestly, and agree in advance what happens when it is exceeded.

## Leadership Example

A finance team produces a weekly report that leaders use for decisions. The team agrees
with its readers that the report may be up to a day late once per quarter, but never in
the week before a board meeting. It tracks lateness. When the allowance is used up early
in a quarter, the team stops taking on new reporting requests and fixes the underlying
process instead of arguing about each late report.

## Product Example

A payment service has an availability target. During a quarter with few incidents, the
team ships features weekly. After two incidents consume most of the quarter's budget,
feature releases pause and the team works on the causes. The pause is not a judgement on
anyone; it is the rule both sides agreed when the budget was set.

## Questions

- What level of failure do the people affected actually notice and mind?
- How much of our allowance have we used, and on what?
- What happens, automatically, when the allowance is spent?
- Which failures should never be inside any budget?

## Common Misuse

An error budget is not permission to treat serious harm as acceptable noise. Failures
involving safety, privacy, money lost or legal obligations need hard limits, not
allowances. Budgets measured against convenient internal numbers rather than what users
experience invite gaming, and a team can stay within budget while users suffer. And a
budget nobody enforces is worse than none, because it gives a false sense of control.
