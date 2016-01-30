BUILD = node_modules/.bin/skewc src --output-file=www/compiled.js

default: build-shaders build-skew-release

npm-modules:
	npm install

build-shaders: | npm-modules
	cp -r src/glsl www

build-skew-debug: | npm-modules
	$(BUILD)

build-skew-release: | npm-modules
	$(BUILD) --release

build-debug: | npm-modules build-skew-debug build-shaders

watch: | npm-modules
	node_modules/.bin/watch src 'clear && make build-debug'

clean:
	echo "[Cleaning]"
	rm www/compiled.js
	rm -rf www/glsl
