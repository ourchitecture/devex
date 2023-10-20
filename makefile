# This is a convenience file.
# Using `pnpm` commands is preferred and is a prerequisite.

# ".DEFAULT_GOAL" instructs which target to use when just `make` is executed
.DEFAULT_GOAL:=all

# "all" is a standard make target
all: check

.PHONY: init
init:
	@pnpm install --recursive --frozen-lockfile
	@cd ./src/backstage/ourstage/ && yarn install

# "check" is a standard make target
.PHONY: check
check: init
	@pnpm test

.PHONY: test
test: check

.PHONY: format
format: init
	@pnpm format

.PHONY: dev
dev: init
	@pnpm test -- --watch

.PHONY: clean
clean:
	@rm --recursive --force \
    ./.task-output/ \
    ./.wireit/ \
    ./src/backstage/ourstage/dist-types/ \
    ./src/backstage/ourstage/packages/backend/dist/

.PHONY: reset
reset: clean
	@rm --recursive --force \
    ./node_modules/ \
    ./src/backstage/ourstage/node_modules/ \
    ./src/backstage/ourstage/packages/app/node_modules/ \
    ./src/backstage/ourstage/packages/backend/node_modules/

# This command assumes that a `sync` will result in two pushes:
# 1) pushing the code
# 2) pushing the tags
# As a result, the first code push should kick off a workflow run before the
# `gh run watch` command is issued. However, there is some risk that this
# sequence could run too quickly before the workflow run is available.
.PHONY: sync
sync:
	@git-town sync
	@gh run watch
