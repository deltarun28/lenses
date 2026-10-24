---
id: verification-is-not-execution
title: Verification Is Not Execution
sequence: 44
categories:
  - Expertise & Learning
  - Organisations
summary: Recognising whether work is correct is a different skill from producing it — sometimes easier, sometimes harder, and usually learned by doing the work.
keywords:
  - review
  - delegation
  - quality assurance
  - checking
related:
  - circle-of-competence
  - swiss-cheese-model
  - shifting-value-of-expertise
  - tacit-knowledge
publishedAt: 2026-10-25
status: published
---

## Principle

Being able to tell whether work is right is a different capability from being able to do
it, and an organisation needs both.

## Explanation

Some work is far easier to check than to produce. Confirming that a key opens a lock,
that a solved puzzle is solved, or that a column adds up takes moments, even when
producing the answer took hours. Other work is as hard to check as to do, or harder. Is
this structural calculation correct? Is this contract sound? Is this diagnosis right?
Checking requires the same expertise as producing, and more effort than it appears,
because the checker must find errors they did not make in reasoning they did not follow.

Organisations often treat review as if it were verification. A signature, a read-through
or "looks fine" stands in for a check of whether the work is correct. Studies of
software code review have found that most review comments concern readability and
structure, not whether the code works. A review that cannot detect the errors that
matter is a ritual, however conscientious the reviewer.

Three consequences follow.

You can safely delegate only what you can specify and verify, or what you can trust
someone else to verify. When producing work becomes cheaper — through outsourcing,
junior staff or new tools — the limit moves to checking it.

The ability to verify is usually built by doing. A reviewer who has never produced the
work can recognise surface quality but not deep error. An organisation that stops doing
a kind of work itself can lose the ability to tell whether its suppliers are doing it
well.

Good checks test the result rather than inspect the document: an independent
recalculation, a test that runs the system, a backup that is actually restored.

## Military Example

A staff officer checks a fire plan by reading it: the grid references look plausible and
the format is correct. Artillery procedure instead requires firing data to be computed
independently by a second person or system and compared. In an exercise, the independent
computation finds a transposed digit that places a target inside the safety distance of
friendly troops. Reading the plan was not checking it.

## Leadership Example

A public body outsources engineering design and keeps one generalist manager to approve
the submissions. Over several years the manager becomes expert at confirming that
documents are complete and in order, and loses any ability to judge whether the designs
are sound. A design flaw passes approval. The body rebuilds a small in-house team that
still does some design work, so it can judge the work it buys.

## Product Example

A team adopts tools that generate code quickly. Output rises, review becomes the
bottleneck, and reviewers start to skim. Defects in production increase. The team moves
the weight of verification onto automated tests that exercise behaviour, and asks
authors to explain each change in their own words, so that someone has understood it,
not only read it.

## Questions

- If this work were subtly wrong, could I tell? How?
- Does our check test the result, or inspect the artefact?
- Who here can verify this work, and how did they learn to?
- If producing this became ten times cheaper, where would the bottleneck move?

## Common Misuse

Not everything needs expert verification. Demanding it everywhere duplicates work and
makes delegation pointless; an established track record is a legitimate substitute for
checking every item. "Only those who can do the work can judge it" is also used to fend
off legitimate outside scrutiny: users can often judge whether a result serves its
purpose without being able to produce it, as a diner can judge a meal. Distinguish
judging fitness for purpose, which many can do, from judging correctness of method,
which needs expertise.
