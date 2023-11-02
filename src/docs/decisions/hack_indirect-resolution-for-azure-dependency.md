---
status: accepted
date: 2023-11-02
deciders: Eric Swanson
---

# Hack indirect resolution for Azure dependency

## Context and Problem Statement

Upgrading to Node v20 Long-Term Support (LTS) resulted in an upstream
dependency error that the package "@azure/msal-node" was not compatible
with Node v20.

## Decision Drivers

-   Use LTS versions of software whenever possible

## Considered Options

-   Leave the project to use Node v18
-   Upgrade to v20 by also forcing an upgrade to a compatible version of the
    "@azure/msal-node" package

## Decision Outcome

Use the `resolutions` section of "package.json" in the Backstage project to
force an upgrade of the "@azure/msal-node" package.

### Consequences

-   Need to remember that this exception exists in the "package.json" file
    under "resolutions".

## More Information

-   See [Backstage issue for Node v20 upgrade](https://github.com/backstage/backstage/issues/20001)
