build-all:
	$(MAKE) build-firefox
	$(MAKE) build-chrome
build-firefox:
	cd firefox && make build
build-chrome:
	cd chrome && make build
