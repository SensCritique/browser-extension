RUN_NODE = docker-compose run node

build-firefox:
	${RUN_NODE} npx webpack --mode=production --config=webpack_firefox.config.js
	cd dist/firefox/main && zip -r ../latest_firefox.zip *
watch-firefox:
	${RUN_NODE} npx webpack --mode=production --config=webpack_firefox.config.js --watch
build-chrome:
	${RUN_NODE} npx webpack --mode=production --config=webpack_chrome.config.js
	cd dist/chrome/main && zip -r ../latest_chrome.zip *
watch-chrome:
	${RUN_NODE} npx webpack --mode=production --config=webpack_chrome.config.js --watch
fix:
	${RUN_NODE} npx eslint --fix src/*
build-all:
	@echo "Did you edit the version on manifest*.json and package.json ? [y/n]" && read ans && [ $${ans:-N} = y ]
	$(MAKE) build-firefox
	$(MAKE) build-chrome
install:
	${RUN_NODE} npm install
test:
	${RUN_NODE} npm test
