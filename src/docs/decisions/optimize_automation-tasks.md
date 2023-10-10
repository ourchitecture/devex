---
status: accepted
date: 2023-09-19
deciders: Ourchitecture
---

# Optimize automation tasks

## Context and Problem Statement

Automation can benefit drastically from caching, dependency management, and more.

## Considered Options

-   Use the standard `npm` "scripts" section in "package.json"
-   Use "wireit" on top of the `npm` "scripts" section in "package.json"
-   Use GNU make
-   Use shell scripts
-   Use any other programming language

## Decision Outcome

Building on the decision to [use NodeJS scripts](./script_automation-tasks.md),
Wireit was selected. The team is already familiar with the choice and the
advantages of Wireit including task dependencies, localized caching as well
as Continuous Integration caching across independent executions, performance
enhancements, multi-project (monorepo) support including dependencies, and more.

### Consequences

-   Good, because Wireit offers distinct advantages the team will leverage
-   Good, because it aligns with previous decisions

## More Information

-   [Wireit website](https://github.com/google/wireit)

\*Standard GNU `make` targets are defined for convenience.
