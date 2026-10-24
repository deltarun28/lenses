---
id: design-for-the-exception
title: Design for the Exception
sequence: 58
categories:
  - Systems Thinking
  - Organisations
summary: Processes are designed around the typical case, but cost and failure concentrate in the cases that do not fit. Design what happens to them.
keywords:
  - edge cases
  - escalation
  - failure demand
  - service design
related:
  - swiss-cheese-model
  - economics-of-judgement
  - capability-requires-maintenance
  - redesign-before-automation
publishedAt: 2026-10-24
status: published
---

## Principle

Design how a system handles the cases that do not fit, not only the cases that do.

## Explanation

Most processes are designed from the typical case: the standard order, the ordinary
claim, the routine request. That case gets the design attention, and it is where
efficiency is measured. Exceptions — the unusual request, the record that does not
match, the situation the form does not cover — are handled by whoever happens to be
nearby, using whatever workaround they can find. Yet a small share of cases frequently
consumes a large share of effort and generates most of the failures and complaints.

The imbalance grows as routine work is automated or standardised. The routine cases
disappear from people's workload, and what remains is a higher concentration of
exceptions, arriving without the context people used to build up by handling the
ordinary ones. Lisanne Bainbridge's classic 1983 paper on the "ironies of automation"
made this point about industrial control: automation takes over the easy parts and
leaves people the hardest situations, with the least practice.

Designing for the exception does not mean building every unusual case into the main
process; that makes the normal path slow and fragile. It means four things: a reliable
way to notice that a case does not fit; a clear route for it; someone at the end of that
route with the authority and information to resolve it; and a habit of turning recurring
exceptions into changes to the normal design.

## Military Example

A logistics system handles standard requests well. Urgent requests for unusual items — a
part for a rare vehicle variant — fall outside it and are resolved by telephone calls
and favours, which work until the person with the contacts is posted. A defined route
for urgent non-standard requests, with a named cell that can authorise them, resolves
them faster and records them. Items that keep appearing are added to standard stock.

## Leadership Example

A human resources process handles standard leave efficiently. An employee with a complex
situation — caring responsibilities, a phased return from illness and a pay query — is
passed between three teams, each of which handles its own part. The organisation creates
a case owner for non-standard situations, with discretion to coordinate the others. The
number of such cases is small; the reduction in distress and staff time is large.

## Product Example

An automated identity check passes about ninety-five per cent of new users instantly.
The rest receive a vague error and are placed in an email queue nobody owns, where they
wait for weeks and generate most of the company's complaints. The team designs that
path: a clear message, a manual review within one working day, and a record of why each
case failed, which is used to improve the automated check.

## Questions

- When a case does not fit, who notices, and where does it go?
- Who at the end of that route has the authority and information to resolve it?
- What share of our effort and complaints comes from exceptions?
- Which recurring exceptions should become part of the standard design?

## Common Misuse

Trying to anticipate every exception produces a system too complicated for the normal
case, which is still most of the work. Sometimes the right answer is to decline the
unusual case, or to accept that it will occasionally be handled badly. Treating every
case as exceptional destroys the benefit of standardisation. Keep the main path simple,
make the exception path clear, and let the pattern of exceptions tell you when the main
path needs to change.
