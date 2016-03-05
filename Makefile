BUILD = node_modules/.bin/skewc src compiled

default: build-release

npm-modules:
	npm install

build-gifs:
	convert -delay 70 www/images/naive*.png www/images/naive.gif
	convert -delay 70 www/images/jfa*.png www/images/jfa.gif
	convert -delay 70 www/images/ray*.png www/images/ray.gif
	convert -delay 70 `ls www/images/jfa*.png | sort -r` www/images/backwards-jfa.gif

build-shaders: | npm-modules
	mkdir -p compiled
	node_modules/.bin/glslx src/lib/jump-flood.glslx --output=compiled/jump-flood-shaders.sk --format=skew --renaming=internal-only --pretty-print

build-demo: | npm-modules build-shaders
	$(BUILD) --output-file=www/demo-compiled.js

build-release: | npm-modules build-shaders
	$(BUILD) --release --output-file=www/demo-compiled.js

watch: | npm-modules
	node_modules/.bin/watch src 'clear && make build-demo'

clean:
	rm www/compiled.js
	rm -rf www/glsl
