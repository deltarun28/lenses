---
id: swiss-cheese-model
title: Swiss Cheese Model
sequence: 57
categories:
  - Systems Thinking
  - Probability & Risk
summary: Serious failures usually pass through several imperfect defences at once — so look for the holes that line up, and the layers that share a weakness.
keywords:
  - layered defence
  - safety
  - accidents
  - redundancy
related:
  - margin-of-safety
  - design-for-the-exception
  - correlated-errors
  - after-action-reviews
publishedAt: 2026-10-25
status: published
---

## Principle

Harm gets through when the weaknesses in several imperfect defences happen to line up.

## Explanation

The psychologist James Reason, studying accidents in aviation, medicine and industry,
pictured an organisation's defences as slices of Swiss cheese. Each layer — a design
feature, a procedure, a check, an alarm, a trained person — has holes, and the holes
move. Most of the time a hole in one layer is covered by another. An accident happens
when, briefly, they line up.

Two consequences follow. First, a serious failure rarely has a single cause, so a search
for "the" cause, or the person who made the final error, misses most of what can be
fixed. Reason distinguished the active failures at the sharp end from the latent
conditions — staffing, design, scheduling — created far from the event, which had been
holding holes open for months.

Second, layers are only as valuable as they are independent. Four checks that all rely
on the same paperwork, the same data source or the same tired supervisor are one check
in disguise. Adding layers that share a weakness adds cost and confidence without adding
much protection.

Reason himself presented the model as a way of thinking rather than a precise theory,
and safety researchers have criticised it for implying that accidents are linear chains.
In complex systems, failures can emerge from normal parts interacting. The model is
still useful for its two main questions: which layers stand between an error and harm,
and do they fail together?

## Military Example

An ammunition handling error should be stopped by clear marking, a crew check, a
supervisor check and a final technical inspection. An investigation finds that all four
checks work from the same incorrectly printed load list. The apparent redundancy is one
layer. Correcting the source document and adding a physical check against the item
itself restores independence.

## Leadership Example

A hospital department has a double-signature rule for high-risk medication. Under
staffing pressure, the second signature is routinely given without looking. On paper
there are two layers; in practice there is one. The fix is not a third signature. It is
a change to staffing at peak times, and an independent check that compares the dose
against the prescription, so the second person checks something rather than someone.

## Product Example

A service protects against data loss with confirmation dialogs, audit logs, access
controls and backups. During a quarterly drill the team restores a backup and finds it
incomplete. The backup had counted as a layer for a year without ever being tested;
until it was, it was a belief, not a barrier.

## Questions

- What layers stand between a likely error and real harm?
- Which of those layers depend on the same person, data or assumption?
- Which layer have we counted but never tested?
- Could the hazard be removed rather than defended against?

## Common Misuse

The model invites a response of adding more layers, and each new check brings delay,
fatigue and workarounds that open holes elsewhere. It can also be used to spread
responsibility so thinly that no failure is ever anyone's to fix. The strongest response
to a hazard is often to remove it, not to stack defences in front of it. Prefer fewer,
independent, tested layers, and investigate near misses, where the holes almost lined
up.
