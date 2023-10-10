---
status: accepted
date: 2023-09-19
deciders: Ourchitecture
---

# Capture automation task output

## Context and Problem Statement

Streaming task automation output to the terminal is useful for humans, but
writing the output to a file can be useful for referencing long after the
task is executed, used for task cache optimizations e.g. wireit, as well
as can be uploaded for specific DevOps pipeline builds e.g. Continuous
Integration.

## Considered Options

-   Pipe command output
-   Capture "stderr" and "stdout"

## Decision Outcome

Building on the decision to [use NodeJS scripts](./script_automation-tasks.md)
as well as [using Wireit](./optimize_automation-tasks.md),
building on top of Node's built-in `exec` function was selected along with
logging through the "winston" library. The team is already familiar with
these technologies.

### Consequences

-   Good, because it enables Wireit output caching
-   Good, because winston is a fairly ubiquitous solution for NodeJS logging
-   Good, because it enables artifact uploads during DevOps pipeline runs
    e.g. Continuous Integration

## More Information

-   [winston website](https://github.com/winstonjs/winston#readme)
