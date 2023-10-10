---
status: accepted
date: 2023-10-10
deciders: Eric Swanson
---

# Apply consistent formatting

## Context and Problem Statement

Inconsistent formatting is a nuisance that distract readers. Eliminate the
inconsistencies!

## Decision Drivers

-   Eliminate reader distractions
-   Provide quick feedback on formatting inconsistencies to source code authors

## Considered Options

-   Not checking formatting
-   Checking formatting
-   Which tools to use

## Decision Outcome

Check general formatting with prettier; familiar with it and good enough.

Check Markdown formatting with "markdownlint", using the "markdownlint-cli2"
tool.

Recommend the VS Code extensions "esbenp.prettier-vscode" and
"davidanson.vscode-markdownlint" to improve the developer experience.

### Consequences

-   Bad, because spelling checks might introduce friction for potential contributions
-   Good, because all current developers agree

## More Information

-   [Prettier website](https://prettier.io/)
