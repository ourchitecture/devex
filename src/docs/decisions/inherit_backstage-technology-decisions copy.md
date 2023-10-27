---
status: 'accepted'
date: 2023-10-10
deciders: Eric Swanson
---

# Hold Backstage upgrade to yarn v3+

## Context and Problem Statement

Corepack is required for the Yarn v3+ upgrade.

-   Corepack is still "experimental".
-   Corepack has a [known issue with Windows + Git BASH file system paths](https://github.com/nodejs/corepack/issues/324)

## Decision Outcome

Chosen option: Hold on any upgrades.
