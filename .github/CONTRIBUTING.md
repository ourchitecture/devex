# Contributing

👋🏽 Welcome. We are happy to accept all types of contributions.

## Get started

Start by reading the project's [history of important decisions](../src/docs/decisions/README.md).

### Prerequisites

-   [NodeJS](https://nodejs.org/)
-   [`pnpm`](https://pnpm.io/)
-   Optionally install [GNU `make`](https://www.gnu.org/software/make/). Linux
    and macOS developers may already have this program installed. Windows users
    may use [Git BASH](https://gitforwindows.org/) along with a
    [compatible binary for running `make`](https://gist.github.com/evanwill/0207876c3243bbb6863e65ec5dc3f058#make).

### Steps

1. Get the code by downloading as a [".zip" archive](https://github.com/ourchitecture/devex/archive/refs/heads/main.zip)
   or clone the repository with the [GitHub CLI](https://cli.github.com/)
   command `gh repo clone ourchitecture/devex`.
2. Install the "Prerequisites"
3. If GNU `make` is installed locally, run the command `make`.
4. If `make` is not installed, run the command `pnpm install --recursive --frozen-lockfile`
   followed by the command `pnpm test`.
