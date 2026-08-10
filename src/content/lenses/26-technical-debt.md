---
id: technical-debt
title: Technical Debt
sequence: 26
categories:
  - Product Thinking
summary: Shortcuts borrow speed now and charge interest on every future change.
keywords:
  - trade-offs
  - maintenance
  - velocity
  - refactoring
related:
  - opportunity-cost
  - conways-law
  - second-order-thinking
publishedAt: 2026-08-10
status: published
---

## Principle

A shortcut taken to move faster now is a loan. The interest is paid on every subsequent
change to that area.

## Explanation

The metaphor is precise and usually misapplied. Debt is not bad code; it is a deliberate
trade of future cost for present speed, and like financial debt it is sometimes the
right decision. Borrowing to reach a deadline that determines whether the product exists
is sound. Borrowing without noticing is not.

The failure is that the interest is invisible. Nobody sees a line item for it — it shows
up as work simply taking longer than it used to, distributed across every task, which is
why it goes unaddressed until velocity has visibly collapsed.

Two questions make it manageable: was this borrowed deliberately, and does anyone intend
to repay it? Debt taken knowingly, recorded, and repaid before it compounds is a tool.
The rest is just accumulated damage.

## Military Example

A field-expedient repair restores a vehicle to service and is exactly the right decision
under time pressure. It also carries an obligation: it is recorded, it constrains how the
vehicle can be used, and it is scheduled for proper repair. A fleet where expedient
repairs are made and not recorded looks serviceable on paper and fails progressively at
the worst moment.

## Leadership Example

A team is directed to hit a launch date and takes shortcuts to do so. Delivery lands, and
the next quarter's plan is set as though capacity is unchanged. Six months later output
has halved and the cause is invisible in any report. The error was not the shortcut; it
was booking the borrowed time as though it had been earned.

## Product Example

A team hard-codes the logic for one large customer to close a deal, which is a
defensible trade. Three deals later there are four hard-coded paths, every change
requires reasoning about all of them, and estimates have tripled. The moment to
generalise was the second customer — the point where the cost of repayment first fell
below the accumulating interest.

## Questions

- Are we borrowing deliberately, and does anyone know we did?
- What is the interest — which future work does this make slower?
- When does this get repaid, and what triggers that?
- Is our current velocity being planned as though we have no debt?

## Common Misuse

The term is routinely used to relabel code someone dislikes or an approach that has
aged, which drains it of meaning — if everything is debt, nothing gets prioritised. It
is equally used to demand rewrites, when most debt is best repaid incrementally in areas
that are actually changing; code that works and is never touched accrues no interest
worth paying. And it can excuse carelessness: work that was never a considered trade is
not debt, it is just poor work.
