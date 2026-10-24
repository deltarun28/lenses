---
id: conways-law
title: Conway's Law
sequence: 25
categories:
  - AI & Technology
  - Systems Thinking
  - Organisations
summary: Systems end up mirroring the communication structure of the organisation that built them.
keywords:
  - architecture
  - org design
  - interfaces
  - teams
related:
  - systems-thinking
  - theory-of-constraints
  - technical-debt
publishedAt: 2026-08-10
status: published
---

## Principle

The structure of what you build will resemble the structure of the group that builds it.

## Explanation

Any interface between two components is also an interface between the people
responsible for them. Where communication is easy, designs stay coupled because
coordinating is cheap. Where it is hard — different teams, sites, time zones,
reporting lines — a boundary appears in the system, because the alternative requires
conversations that are expensive to have.

This is descriptive, not a recommendation. It happens whether or not anyone intends it,
which is why architecture reviews that ignore organisational structure produce designs
that quietly deform back into the org chart over a year or two.

The useful version is deliberate: decide the architecture you want, then arrange teams
so that the boundaries you want are the cheap ones. Organisational design is technical
design.

## Military Example

Joint operations produce systems that mirror service boundaries. Communications,
targeting and logistics interfaces cluster at exactly the points where two services must
coordinate, because those are the places where agreement is expensive. The fix that
works is not a better technical specification but a joint headquarters — moving the
people so the boundary stops being costly.

## Leadership Example

An organisation with separate front-end, back-end and data teams reliably produces
systems with a hard seam at each of those points, and features that cross all three take
three times as long. Reorganising into teams that own a customer outcome end to end
changes the architecture within a year, without anyone specifying a new architecture.

## Product Example

A company with a mobile team and a web team ends up with two implementations of the same
business rules, which drift. The duplication is not incompetence; it is cheaper for each
team than coordinating on a shared layer. A single team owning that layer, with both
clients consuming it, removes the duplication by removing the communication cost that
created it.

## Questions

- Which boundaries in this design match boundaries between teams?
- Is the architecture I want cheap or expensive for this organisation to build?
- What conversation is this interface avoiding?
- If I want a different system shape, what team structure would produce it?

## Common Misuse

Treated as fatalism, it becomes an argument that architecture cannot be chosen — it can,
it just has to be supported by structure. It is also used to justify constant
reorganisation, which is enormously disruptive and usually produces new seams rather
than removing them. And it describes a tendency, not a determinism: disciplined teams do
build across their own boundaries, it simply costs them more than it appears to.
