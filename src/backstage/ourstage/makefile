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

.PHONY: install-base-images
install-base-images:
	@podman pull docker.io/library/node:20.9-bookworm \
	&& podman tag docker.io/library/node:20.9-bookworm localhost/ourstage-node:latest
	@podman pull docker.io/spotify/techdocs:v1.2.3 \
	&& podman tag docker.io/spotify/techdocs:v1.2.3 localhost/ourstage-techdocs:latest
	@podman pull mcr.microsoft.com/playwright:v1.39.0-jammy \
	&& podman tag mcr.microsoft.com/playwright:v1.39.0-jammy localhost/ourstage-playwright:latest
	@podman pull docker.io/library/nginx:1.25.3-bookworm \
	&& podman tag docker.io/library/nginx:1.25.3-bookworm localhost/ourstage-nginx:latest

npm_registry_url=http://localhost:8081/repository/npm-all/

.PHONY: install-image-init
install-image-init:
	@podman run \
		--name ourstage-install \
		--rm \
		--tty \
		--volume .:/usr/local/src/ourstage/ \
		--workdir /usr/local/src/ourstage/ \
		--network host \
		localhost/ourstage-node:latest \
		yarn install --frozen-lockfile --registry $(npm_registry_url)

.PHONY: install-image-build
install-image-build:
	@podman run \
		--name ourstage-build \
		--rm \
		--tty \
		--volume .:/usr/local/src/ourstage/ \
		--workdir /usr/local/src/ourstage/ \
		--network host \
		localhost/ourstage-node:latest \
		yarn build:all

.PHONY: install-image-backend
install-image-backend:
	@podman build \
		--tag ourstage-backend \
		--file ./packages/backend/Containerfile \
		--network host \
		.

.PHONY: install-image
install-image: install-image-init install-image-build install-image-backend

.PHONY: start-image-backend
start-image-backend:
	@podman run \
		--name ourstage-backend \
		--detach \
		--publish 7007:7007 \
		localhost/ourstage-backend:latest

.PHONY: start-image-app
start-image-app:
	@cd ./packages/app/dist/ \
	&& MSYS_NO_PATHCONV=1 \
	podman run \
		--name ourstage-app \
		--detach \
		--volume ../../../nginx.conf:/etc/nginx/nginx.conf:ro \
		--volume .:/usr/share/nginx/html:ro \
		--publish 3000:80 \
		localhost/ourstage-nginx:latest

.PHONY: start-image
start-image: start-image-backend start-image-app

.PHONY: stop-image
stop-image:
	@podman stop ourstage-app
	@podman stop ourstage-backend

.PHONY: clean-image-app
clean-image-app:
	@podman rm --force ourstage-app

.PHONY: clean-image-backend
clean-image-backend:
	@podman rm --force ourstage-backend

.PHONY: clean-image
clean-image: clean-image-app clean-image-backend

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
