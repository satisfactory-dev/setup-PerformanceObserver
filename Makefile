install:
	@NODE_OPTIONS='' npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app.json

lint--tsc:
	@echo 'running syntax check'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app-check.json

lint--prettier:
	@echo 'running prettier'
	@NODE_OPTIONS='' ./node_modules/.bin/prettier . --check

lint--eslint:
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.eslint.json
	@echo 'checking eslint for all issues with config'
	@./node_modules/.bin/eslint --config eslint.config.js.mjs --cache './**/*.mjs'
	@echo 'checking eslint for all issues'
	@./node_modules/.bin/eslint --cache './**/*.ts'

lint: lint--prettier lint--tsc lint--eslint

.PHONY: tests
tests: build
	@./node_modules/.bin/ts-node ./tests.ts

.PHONY: coverage
coverage: build
	@./node_modules/.bin/c8 ./node_modules/.bin/ts-node ./tests.ts

npm-prep: tests
	@echo 'building from ./tsconfig.app-npm.json'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app-npm.json
	@npm publish --dry-run
