# Intro
This repository contains two extensions, one for firefox and one for Chrome but both extension shared the same code.
All the code is the same for Chrome and Firefox except for the event system which is a Chrome event bus supported by Firefox too.

# Workflow
##### Content_script
- Netflix: Fetch video info (name)
##### Background
- SensCritique (HTTP): Fetch video ID and Type
- SensCritique (HTTP): Fetch video note
##### Content_script
- SensCritique-extension: Generate DOM with providers notes.

# Installation / Test
## Installation
Same installation for both Firefox/Chrome: 
- Require a working `docker` and `docker-compose` installation.
- `make install`
- `make watch-firefox` or `make watch-chrome` to run webpack in watch-mode.
## Dev
#### Chrome
- Go to `chrome://extensions/`
- `Load unpackaged extension` and choose `dist/main/chrome` folder
- For every code changes, click on the `Refresh` button.

#### Firefox
- Go to the debug extensions page `about:debugging#/runtime/this-firefox`
- `Load a temporary add-on module` and choose `dist/main/firefox`
- For every code changes, click on the `Refresh` button.

# Contribute
- Use issues to report bugs and use the discussion tab for suggestions or help.
- Fork this repository and create a PR 
