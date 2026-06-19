# Learning Vault

This context describes a personal learning workspace where AI-assisted lessons are captured as durable study material for later review.

## Language

**Learning Vault**:
A personal workspace that stores AI-assisted learning material for later review.
_Avoid_: Project, repository, knowledge base

**Teach Session**:
A guided learning interaction powered by the `teach` skill.
_Avoid_: Chat, explanation, tutoring run

**Learning Index**:
A top-level table of contents for finding saved learning material.
_Avoid_: Dashboard, catalog, sitemap

**Topic Summary**:
A long-form synthesis of a completed learning thread for later review.
Use this for final topic-level summaries that are too broad for a quick reference sheet.
_Avoid_: Learning record, cheat sheet

**Index Update**:
The act of adding newly created learning material to the Learning Index immediately after a Teach Session.
_Avoid_: Sync, rebuild, publish

## Relationships

- A **Learning Vault** contains many **Teach Sessions**
- A **Teach Session** produces reviewable learning material inside the **Learning Vault**
- A **Learning Index** points to learning material stored in the **Learning Vault**
- A **Topic Summary** preserves the consolidated outcome of one or more related **Teach Sessions**
- A **Teach Session** is followed by an **Index Update** when it creates saved learning material

## Example dialogue

> **Dev:** "When the user wants to learn a concept, should the Learning Vault explain it directly?"
> **Domain expert:** "No - the Teach Session explains the concept, and the Learning Vault preserves the useful output for review."
> **Dev:** "Where should the user start when looking for old material?"
> **Domain expert:** "Start from the Learning Index; it links to the saved lessons, references, and records."
> **Dev:** "Where should a long final write-up for a topic go?"
> **Domain expert:** "Use a Topic Summary. References stay short and lookup-oriented; learning records stay focused on what changed in the learner's understanding."
> **Dev:** "Who keeps the Learning Index current?"
> **Domain expert:** "The agent performs an Index Update whenever a Teach Session creates saved learning material."

## Flagged ambiguities

- "AI explains concepts" is resolved as **Teach Session** responsibility, not a separate learning engine owned by the **Learning Vault**.
- "Final summary" is resolved as **Topic Summary**, stored separately from quick reference documents and learning records.
