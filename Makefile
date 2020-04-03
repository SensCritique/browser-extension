build:
	cp -R images dist/main
	cp manifest.json dist/main
	npm run-script build-production
deploy:
	$(MAKE) build
	./node_modules/.bin/web-ext sign --api-key=${apiKey} --api-secret=${apiSecret} --source-dir=dist/main/
