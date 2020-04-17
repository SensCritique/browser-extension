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
	$(MAKE) build-firefox
	$(MAKE) build-chrome
