build-firefox:
	./node_modules/.bin/webpack --mode=production --config=webpack_firefox.config.js
	cd dist/firefox/main && zip -r ../latest.zip *
watch-firefox:
	./node_modules/.bin/webpack --mode=production --config=webpack_firefox.config.js --watch
build-chrome:
	./node_modules/.bin/webpack --mode=production --config=webpack_chrome.config.js
	cd dist/chrome/main && zip -r ../latest.zip *
watch-chrome:
	./node_modules/.bin/webpack --mode=production --config=webpack_chrome.config.js --watch
build-all:
	@echo "Did you edit the version on manifest*.json and package.json ? [y/n]" && read ans && [ $${ans:-N} = y ]
	$(MAKE) build-firefox
	$(MAKE) build-chrome
