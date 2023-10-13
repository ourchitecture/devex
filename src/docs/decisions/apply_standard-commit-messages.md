---
status: accepted
date: 2023-10-10
deciders: Eric Swanson
---

# Apply standard commit messages

## Context and Problem Statement

Free-form commit messages are a temptation for lazy descriptions of
contributions. A basic, standardized approach to commit messages can
improve meaning and consistency as well as introduce an opportunity
for improved automation.

## Considered Options

-   Not checking commit messages
-   Checking commit messages
-   Which tools to use

## Decision Outcome

Check commit messages against the "Conventional Commits" specification;
familiar with it and good enough.

Use the "@commitlint/cli" tool to check commit messages.

Use Husky and git hooks to enforce automation checks.

### Consequences

-   Good, because it ensures a basic level of meaning to commits
-   Good, because it enables opportunities to automate based on commit messages
-   Bad, because it interupts a standard developer flow with a potentially
    unfamilar process and tooling

## More Information

-   [Conventional commits website](https://www.conventionalcommits.org/)
-   [githooks website](https://git-scm.com/docs/githooks)
-   [Husky website](https://typicode.github.io/husky/)
-   ["commitlint" website](https://commitlint.js.org/)
