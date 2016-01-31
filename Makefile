BUILD = node_modules/.bin/skewc src --output-file=www/compiled.js

default: build-shaders build-skew-release

npm-modules:
	npm install

build-shaders: | npm-modules
	node_modules/.bin/glslx src/shaders.glsl --output=src/shaders.sk --format=skew --renaming=internal-only --pretty-print

build-debug: | npm-modules build-shaders
	$(BUILD)

build-release: | npm-modules build-shaders
	$(BUILD) --release

watch: | npm-modules
	node_modules/.bin/watch src 'clear && make build-debug'

clean:
	rm www/compiled.js
	rm -rf www/glsl
