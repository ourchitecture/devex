# This is a convenience file.
# Using `pnpm` commands is preferred and is a prerequisite.

# ".DEFAULT_GOAL" instructs which target to use when just `make` is executed
.DEFAULT_GOAL:=all

# "all" is a standard make target
all: check

.PHONY: init
init:
	@pnpm install --recursive --frozen-lockfile

# "check" is a standard make target
.PHONY: check
check: init
	@pnpm test

.PHONY: test
test: check

.PHONY: format
format: init
	@pnpm format

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
