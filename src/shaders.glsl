// TODO(ryan): How slow does this make things on mobile devices?
precision highp float;

uniform sampler2D cellGridTexture;
uniform vec2 gridSize; // Width and height of cellGridTexture
uniform vec2 canvasSize; // Size of HTML canvas element
uniform vec2 viewportOffset; // Viewport offset in grid space
uniform vec2 viewportSize; // Viewport size in grid space
uniform int RELEASE; // Used for debugging
uniform sampler2D seedTexture;
uniform int seedTextureSize;
uniform vec2 cellGridSize;
uniform int stepSize;

////////////////////////////////////////////////////////////////////////
//
//                           Helpers
//
////////////////////////////////////////////////////////////////////////

const float EPSILON = 0.0001;

const vec4 RED = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 CYAN = vec4(0.0, 1.0, 1.0, 1.0);
const vec4 MAGENTA = vec4(1.0, 0.0, 1.0, 1.0);
const vec4 YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 WHITE = vec4(1.0, 1.0, 1.0, 1.0);

int modInt(int a, int b) {
    return int(mod(float(a), float(b)));
}

bool approxEqual(float a, float b) {
    return abs(a - b) < EPSILON;
}

vec2 gridPositionToUv(vec2 position, vec2 gridSize) {
    return position / gridSize;
}

bool between(vec2 value, vec2 bottom, vec2 top) {
    return value.x > bottom.x && value.x < top.x && value.y > bottom.y && value.y < top.y;
}

vec2 gridPointFromFragCoord(vec2 fragCoord) {
    // UV co-ordinates of the pixel we're drawing in canvas space
    vec2 canvasSpaceUv = gl_FragCoord.xy / canvasSize;

    // Use that to find the grid point that we're drawing
    return viewportOffset + viewportSize * canvasSpaceUv;
}

bool validUv(vec2 uv) {
    return uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0;
}

////////////////////////////////////////////////////////////////////////
//
//                           Draw Quad
//
////////////////////////////////////////////////////////////////////////

attribute vec2 quad;

export void vCopyPosition() {
    gl_Position = vec4(quad, 0, 1.0);
}

////////////////////////////////////////////////////////////////////////
//
//                           Game of Life
//
////////////////////////////////////////////////////////////////////////

vec4 encodeObject(bool isSeed, int seedIndex, vec2 location) {
    return vec4(isSeed ? 1.0 : 0.0, float(seedIndex), location);
}

bool objectIsSeed(const vec4 obj) {
    return approxEqual(obj[0], 1.0);
}

int objectSeedIndex(const vec4 obj) {
    return int(obj[1]);
}

vec2 objectSeedLocation(const vec4 obj) {
    return vec2(obj[2], obj[3]);
}

bool objectIsValid(const vec4 obj) {
    return !approxEqual(obj[0], -1.0);
}

// Return the value of the grid as position gl_FragCoord.xy + offset
vec4 gridGet(vec2 offset) {
    vec2 gridUv = gridPositionToUv(gl_FragCoord.xy + offset, cellGridSize);
    if (!validUv(gridUv)) {
        // Return -1 for invalid offset (not on grid)
        return vec4(-1.0, -1.0, -1.0, -1.0);
    }
    return texture2D(cellGridTexture, gridUv);
}

vec4 getObjectForOffset(const vec4 self, const vec2 offset) {
    vec4 other = gridGet(offset);
    if (!objectIsValid(other)) {
        // Other is invalid - offset must have been off the grid.
        return self;
    }

    if (objectSeedIndex(other) < 0) {
        // Other's seed location hasn't been set
        return self;
    }

    else if (objectSeedIndex(self) < 0) {
        // Our seed location hasn't been set
        return encodeObject(false, objectSeedIndex(other), objectSeedLocation(other));
    }

    else {
        vec2 selfSeed = objectSeedLocation(self);
        vec2 otherSeed = objectSeedLocation(other);
        if (distance(selfSeed, gl_FragCoord.xy) > distance(otherSeed, gl_FragCoord.xy)) {
            return encodeObject(false, objectSeedIndex(other), otherSeed);
        }
    }

    return self;
}

export void fGameOfLife() {
    vec4 object = gridGet(vec2(0, 0));
    gl_FragColor = object;

    if (!objectIsSeed(object)) {
        object = getObjectForOffset(object, vec2(0, stepSize));
        object = getObjectForOffset(object, vec2(stepSize, stepSize));
        object = getObjectForOffset(object, vec2(stepSize, 0));
        object = getObjectForOffset(object, vec2(stepSize, -1 * stepSize));
        object = getObjectForOffset(object, vec2(0, -1 * stepSize));
        object = getObjectForOffset(object, vec2(-1 * stepSize, -1 * stepSize));
        object = getObjectForOffset(object, vec2(-1 * stepSize, 0));
        object = getObjectForOffset(object, vec2(-1 * stepSize, stepSize));
        gl_FragColor = object;
    }
}

////////////////////////////////////////////////////////////////////////
//
//                            Draw grid
//
////////////////////////////////////////////////////////////////////////

void drawDebugUI(vec2 gridPoint) {
    if (RELEASE == 1) {
        return;
    }

    vec4 lightRed = vec4(1.0, 0.5, 0.5, 1.0);
    vec4 lightBlue = vec4(0.5, 0.5, 1.0, 1.0);
    vec4 lightGreen = vec4(0.5, 1.0, 0.5, 1.0);

    // Show a red 100x100 cell grid
    if (mod(gridPoint.x, 100.0) < 3.0 || mod(gridPoint.y, 100.0) < 3.0) {
        gl_FragColor = (lightRed + gl_FragColor) / 2.0;
    }

    // Show a green marker at (0, 0)
    if (between(gridPoint.xy, vec2(0.0, 0.0), vec2(10.0, 10.0))) {
        gl_FragColor = (lightGreen + gl_FragColor) / 2.0;
    }

    // Show a blue marker at (100, 100)
    if (between(gridPoint.xy, vec2(100.0, 100.0), vec2(110.0, 110.0))) {
        gl_FragColor = (lightBlue + gl_FragColor) / 2.0;
    }
}

export void fDrawGrid() {
    vec2 gridPoint = gridPointFromFragCoord(gl_FragCoord.xy);
    vec2 gridUv = gridPoint / gridSize;

    if (!validUv(gridUv)) {
        gl_FragColor = BLACK;
        drawDebugUI(gridPoint);
        return;
    }

    vec4 object = texture2D(cellGridTexture, gridUv);
    int seedIndex = objectSeedIndex(object);
    int x = modInt(seedIndex, seedTextureSize);
    int y = seedIndex / seedTextureSize;
    vec2 seedTexelCoord = vec2(float(x), float(y));
    vec2 seedUv = seedTexelCoord / float(seedTextureSize);
    gl_FragColor = texture2D(seedTexture, seedUv);
}