BUILD = node_modules/.bin/skewc src compiled

default: build-release

npm-modules:
	npm install

build-shaders: | npm-modules
	mkdir -p compiled
	node_modules/.bin/glslx src/voronoi/jump-flood.glslx --output=compiled/jump-flood-shaders.sk --format=skew --renaming=internal-only --pretty-print

build-demo: | npm-modules build-shaders
	$(BUILD) --output-file=www/demo-compiled.js

build-release: | npm-modules build-shaders
	$(BUILD) --release --output-file=www/demo-compiled.js

watch: | npm-modules
	node_modules/.bin/watch src 'clear && make build-demo'

clean:
	rm www/compiled.js
	rm -rf www/glsl
