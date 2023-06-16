RUN_NODE = docker-compose run --rm -Ti node

.PHONY: build-firefox
build-firefox:
	${RUN_NODE} npx webpack --mode=production --env=production --config=webpack_firefox.config.js
	cd dist/firefox/main && zip -r ../latest_firefox.xpi * && mv ../latest_firefox.xpi ../../../releases/
.PHONY: watch-firefox
watch-firefox:
	${RUN_NODE} npx webpack --mode=development --env=development --config=webpack_firefox.config.js --watch
.PHONY: build-chrome
build-chrome:
	${RUN_NODE} npx webpack --mode=production --env=production --config=webpack_chrome.config.js
	cd dist/chrome/main && zip -r ../latest_chrome.zip * && mv ../latest_chrome.zip ../../../releases/
.PHONY: watch-chrome
watch-chrome:
	${RUN_NODE} npx webpack --mode=development --env=development --config=webpack_chrome.config.js --watch
.PHONY: build-opera
build-opera:
	${RUN_NODE} npx webpack --mode=production --env=production --config=webpack_opera.config.js
	cd dist/opera/main && zip -r ../latest_opera.zip * && mv ../latest_opera.zip ../../../releases/
.PHONY: watch-opera
watch-opera:
	${RUN_NODE} npx webpack --mode=development --env=development --config=webpack_opera.config.js --watch
.PHONY: fix
fix:
	${RUN_NODE} npx eslint --fix src/*
.PHONY: build-all
build-all:
	@echo "Did you edit the version on manifest*.json and package.json ? [y/n]" && read ans && [ $${ans:-N} = y ]
	$(MAKE) build-firefox
	$(MAKE) build-chrome
.PHONY: install
install:
	${RUN_NODE} npm install
.PHONY: test
test:
	${RUN_NODE} npm test ${FILE}
.PHONY: sh
sh:
	${RUN_NODE} sh
.PHONY: lint
lint:
	${RUN_NODE} npx eslint --fix src/ --ext .ts
