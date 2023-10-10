---
status: accepted
date: 2023-09-19
deciders: Ourchitecture
---

# Manage automation task package dependencies

## Context and Problem Statement

Building on top of the decision ["Use NodeJS scripts for developer task automation"](./script_automation-tasks.md),
the NodeJS package management offers a handful of unique tool choices.

## Considered Options

-   Use `npm`
-   Use `yarn`
-   Use `pnpm`

## Decision Outcome

Use `pnpm`. Team has worked with all of these tools extensively and has found
some advantages with `pnpm` in performance, multi-project workspaces (monorepo),
and task management.

### Consequences

-   Good, because `pnpm` is already a proven choice for the team
-   Bad, because `pnpm` requires an additional install on top of NodeJS
    (`npm` and `yarn` are typically bundled with NodeJS)
-   Good, because `pnpm` was specifically designed to address shortcoming in
    `npm` and has generally stayed "ahead" of `npm`

## More information

-   [`npm` website](https://docs.npmjs.com/about-npm)
-   [`yarn` website](https://yarnpkg.com/)
-   [`pnpm` website](https://pnpm.io/)
