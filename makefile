# This is a convenience file.
# Using `pnpm` commands is preferred and is a prerequisite.

# ".DEFAULT_GOAL" instructs which target to use when just `make` is executed
.DEFAULT_GOAL:=all

# "all" is a standard make target
all: init check install

.PHONY: init
init:
	@pnpm install --recursive --frozen-lockfile
	@cd ./src/backstage/ourstage/ && "$(MAKE)" $@

# "check" is a standard make target
.PHONY: check
check:
	@pnpm check
	@cd ./src/backstage/ourstage/ && "$(MAKE)" $@

.PHONY: test
test: check

# "install" is a standard make target
.PHONY: install
install:
	@cd ./src/backstage/ourstage/ && "$(MAKE)" $@

.PHONY: format
format:
	@pnpm format
	@cd ./src/backstage/ourstage/ && "$(MAKE)" $@

.PHONY: dev
dev:
	@pnpm check -- --watch

.PHONY: clean
clean:
	@rm --recursive --force \
    ./.task-output/ \
    ./.wireit/
	@cd ./src/backstage/ourstage/ && "$(MAKE)" $@

.PHONY: reset
reset: clean
	@rm --recursive --force \
	./node_modules/
	@cd ./src/backstage/ourstage/ && "$(MAKE)" $@

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
