BUILD = node_modules/.bin/skewc src compiled/shaders.sk

default: build-release

npm-modules:
	npm install

build-shaders: | npm-modules
	node_modules/.bin/glslx src/lib/shaders.glslx --output=compiled/shaders.sk --format=skew --renaming=internal-only --pretty-print

build-paint-demo: | npm-modules build-shaders
	$(BUILD) --define:PAINT_DEMO=true --output-file=www/paint-demo-compiled.js

watch: | npm-modules
	node_modules/.bin/watch src 'clear && make build-paint-demo'

clean:
	rm www/compiled.js
	rm -rf www/glsl
