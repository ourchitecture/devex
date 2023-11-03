# This is a convenience file.
# Using `pnpm` commands is preferred and is a prerequisite.

# ".DEFAULT_GOAL" instructs which target to use when just `make` is executed
.DEFAULT_GOAL:=all

# "all" is a standard make target
all: init check install

# BUG: Node engines issue https://github.com/backstage/backstage/issues/20881
.PHONY: init
init:
	@yarn install \
		--frozen-lockfile \
		--ignore-engines
	@pip install --requirement ./python-requirements.txt

.PHONY: info
info:
	@yarn backstage-cli info

.PHONY: lint
lint:
	@yarn lint:all

.PHONY: test
test:
	@yarn test:all

# "check" is a standard make target
.PHONY: check
check: lint test

# "install" is a standard make target
.PHONY: install
install:
	@yarn tsc:full
	@yarn build:all

.PHONY: format
format: init
	@yarn fix

.PHONY: dev
dev: init
	@yarn dev

.PHONY: upgrade
upgrade: init
	@yarn backstage-cli versions:bump --release next
	@yarn upgrade

.PHONY: clean
clean:
	@yarn clean
	@rm --recursive --force \
		./coverage/ \
		./dist-types/ \
		./packages/app/dist/ \
		./packages/backend/dist/

.PHONY: reset
reset: clean
	@rm --recursive --force \
		./node_modules/ \
		./packages/app/node_modules/ \
		./packages/backend/node_modules/
