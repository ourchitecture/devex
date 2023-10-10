---
status: accepted
date: 2023-10-10
deciders: Eric Swanson
---

# Script automation tasks

## Context and Problem Statement

End-to-end DevOps tasks require automation, including developer tasks and
continuous integration and deployment.

## Considered Options

-   Use GNU Make
-   Use shell scripts
-   Use NodeJS scripts
-   Use any other programming language

## Decision Outcome

Use NodeJS scripts. Team is familiar. As a project focused on web technologies,
JavaScript will be the prevailing language. Shell scripts and GNU `make` were
strongly considered. However, developers using Windows have to run a shell
emulator like Git BASH, Cygwin, etc. or Windows Subsystem for Linux (WSL).

### Consequences

-   Good, because the technology choice will align with other future
    technologies in this project

## More Information

-   [NodeJS website](https://nodejs.org/en/)

\*Standard GNU `make` targets are defined for convenience.
