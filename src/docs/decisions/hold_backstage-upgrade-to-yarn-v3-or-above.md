---
status: 'accepted'
date: 2023-10-10
deciders: Eric Swanson
---

# Inherit Backstage technology decisions

## Context and Problem Statement

The open source project Backstage is implemented as a product in the "./src/"
directory and uses different technology decisions than this project like
`yarn` instead of `pnpm`, Yarn workspaces instead of Pnpm workspaces, and
Lerna monorepo task management instead of Wireit.

## Considered Options

-   Contribute to [support for alternative package managers to `yarn`](https://github.com/backstage/backstage/issues/20658)
-   Isolate Backstage and inherit all technology and conventions

## Decision Outcome

Chosen option: Isolate and inherit Backstage conventions and technology.
