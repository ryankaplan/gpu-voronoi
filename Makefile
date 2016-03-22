BUILD = node_modules/.bin/skewc src compiled

default: build-release

npm-modules:
	npm install

build-shaders: | npm-modules
	mkdir -p compiled
	node_modules/.bin/glslx src/jump-flood/jump-flood.glslx --output=compiled/jump-flood-shaders.sk --format=skew --pretty-print

build-demo: | npm-modules build-shaders
	$(BUILD) --output-file=www/demo-compiled.js

build-release: | npm-modules build-shaders
	$(BUILD) --release --output-file=www/demo-compiled.js

watch: | npm-modules
	node_modules/.bin/watch src 'clear && make build-demo'

clean:
	rm www/compiled.js
	rm -rf www/glsl

# Useful for building the demo for the blog post on my personal website.
# I don't like that I'm compiling to a directory outside of this repo, but
# this will have to do until Skew has a package manager.

blog-demo: | npm-modules build-shaders
	$(BUILD) --release --output-file=../../compiled/voronoi-demo.js

blog-demo-debug: | npm-modules build-shaders
	$(BUILD) --output-file=../../compiled/voronoi-demo.js

watch-blog-demo: | npm-modules
	node_modules/.bin/watch src 'clear && make blog-demo-debug'
