BUILD = node_modules/.bin/skewc src compiled/shaders.sk --output-file=www/compiled.js

default: build-release

npm-modules:
	npm install

build-shaders: | npm-modules
	node_modules/.bin/glslx src/shaders.glslx --output=compiled/shaders.sk --format=skew --renaming=internal-only --pretty-print

build-debug: | npm-modules build-shaders
	$(BUILD)

build-release: | npm-modules build-shaders
	$(BUILD) --release

watch: | npm-modules
	node_modules/.bin/watch src 'clear && make build-debug'

clean:
	rm www/compiled.js
	rm -rf www/glsl
