build:
	rm -Rf dist/main/*
	cp -R ../images dist/main/images
	cp manifest.json dist/main
	npm run-script build-production
deploy:
	./node_modules/.bin/web-ext build --source-dir=dist/main/
