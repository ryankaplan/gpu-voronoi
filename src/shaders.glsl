// TODO(ryan): How slow does this make things on mobile devices?
precision highp float;

uniform sampler2D iCellGridTexture;
uniform vec2 iGridSize; // Width and height of iCellGridTexture
uniform vec2 iCanvasSize; // Size of HTML canvas element
uniform vec2 iViewportOffset; // Viewport offset in grid space
uniform vec2 iViewportSize; // Viewport size in grid space
uniform int iRelease; // Used for debugging
uniform vec2 iCellGridSize;
uniform int iStepSize;

// The color that is *not* to be counted as seed.
uniform vec4 iBackgroundColor;

// Helpers
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

int encodeColorValues(int a, int b) {
    return a * 256 + b;
}

vec2 decodeColorValues(int encoded) {
    return vec2(encoded / 256, modInt(encoded, 256));
}

bool approxEqual(float a, float b) {
    return abs(a - b) < EPSILON;
}

bool approxEqual(vec2 a, vec2 b) {
    return
        approxEqual(a[0], b[0]) &&
        approxEqual(a[1], b[1]);
}

bool approxEqual(vec3 a, vec3 b) {
    return
        approxEqual(a[0], b[0]) &&
        approxEqual(a[1], b[1]) &&
        approxEqual(a[2], b[2]);
}
bool approxEqual(vec4 a, vec4 b) {
    return
        approxEqual(a[0], b[0]) &&
        approxEqual(a[1], b[1]) &&
        approxEqual(a[2], b[2]) &&
        approxEqual(a[3], b[3]);
}

vec2 gridPositionToUv(vec2 position, vec2 iGridSize) {
    return position / iGridSize;
}

bool between(vec2 value, vec2 bottom, vec2 top) {
    return value.x > bottom.x && value.x < top.x && value.y > bottom.y && value.y < top.y;
}

vec2 gridPointFromFragCoord(vec2 fragCoord) {
    // UV co-ordinates of the pixel we're drawing in canvas space
    vec2 canvasSpaceUv = gl_FragCoord.xy / iCanvasSize;

    // Use that to find the grid point that we're drawing
    return iViewportOffset + iViewportSize * canvasSpaceUv;
}

bool validUv(vec2 uv) {
    return uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0;
}

// Vertex shader for drawing a quad
////////////////////////////////////////////////////////////////////////

attribute vec2 quad;

export void vCopyPosition() {
    gl_Position = vec4(quad, 0, 1.0);
}

// Each pixel in our grid texture is a cell object. Each cell contains
// the following info (-1.0, seedIndex, locationX, locationY). The
// following functions are an 'object-oriented' set of functions for
// handling cells.
////////////////////////////////////////////////////////////////////////

vec4 createCell(float rg, float ba, vec2 location) {
    return vec4(rg, ba, location);
}

vec4 createInvalidCell() {
    return vec4(-1.0, -1.0, -1.0, -1.0);
}

vec4 cellColor(const vec4 cell) {
    int rg = int(cell[0]);
    int ba = int(cell[1]);
    return vec4(decodeColorValues(rg), decodeColorValues(ba)) / 255.;
}

vec2 cellSeedLocation(const vec4 obj) {
    return vec2(obj[2], obj[3]);
}

bool cellIsValid(const vec4 obj) {
    return !approxEqual(obj[1], -1.0);
}

// Fragment shader for prepping an image as a set of seeds ready for JFA
////////////////////////////////////////////////////////////////////////

export void fPrepForJFA() {
    vec2 gridUv = gridPositionToUv(gl_FragCoord.xy, iCellGridSize);
    vec4 pixel = texture2D(iCellGridTexture, gridUv);

    if (approxEqual(pixel, iBackgroundColor)) {
        gl_FragColor = createInvalidCell();
    } else {
        int rg = encodeColorValues(int(pixel.r * 256.), int(pixel.g * 256.));
        int ba = encodeColorValues(int(pixel.b * 256.), int(pixel.a * 256.));
        gl_FragColor = createCell(float(rg), float(ba), gl_FragCoord.xy);
    }
}

// Fragment shader for the Jump Flood algorithm
////////////////////////////////////////////////////////////////////////

vec4 getCellForOffset(const vec4 self, const vec2 offset) {
    vec2 gridUv = gridPositionToUv(gl_FragCoord.xy + offset, iCellGridSize);
    vec4 other = validUv(gridUv) ? texture2D(iCellGridTexture, gridUv) : createInvalidCell();

    if (!cellIsValid(other)) {
        // Other is invalid. This means that 'offset' is off the grid or
        // 'otherCell' doesn't have any seed info yet.
        return self;
    }

    else if (!cellIsValid(self)) {
        // Our seed location hasn't been set but other's has.
        return other;
    }

    else {
        vec2 selfSeed = cellSeedLocation(self);
        vec2 otherSeed = cellSeedLocation(other);
        if (distance(selfSeed, gl_FragCoord.xy) > distance(otherSeed, gl_FragCoord.xy)) {
            return other;
        }
    }

    return self;
}

export void fGameOfLife() {
    // Find the object at this grid position
    vec2 gridUv = gridPositionToUv(gl_FragCoord.xy, iCellGridSize);

    // We gridUv should always be valid. We run this once for every
    // cell in the grid.
    if (!validUv(gridUv)) {
        discard;
    }

    vec4 object = texture2D(iCellGridTexture, gridUv);

    object = getCellForOffset(object, vec2(0, iStepSize));
    object = getCellForOffset(object, vec2(iStepSize, iStepSize));
    object = getCellForOffset(object, vec2(iStepSize, 0));
    object = getCellForOffset(object, vec2(iStepSize, - iStepSize));
    object = getCellForOffset(object, vec2(0, - iStepSize));
    object = getCellForOffset(object, vec2(- iStepSize, - iStepSize));
    object = getCellForOffset(object, vec2(- iStepSize, 0));
    object = getCellForOffset(object, vec2(- iStepSize, iStepSize));

    gl_FragColor = object;
}

// Fragment shader for drawing the result of the Jump Flood algorithm
////////////////////////////////////////////////////////////////////////

void drawDebugUI(vec2 gridPoint) {
    if (iRelease == 1) {
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
    vec2 gridUv = gridPoint / iGridSize;

    if (!validUv(gridUv)) {
        gl_FragColor = BLACK;
        drawDebugUI(gridPoint);
        return;
    }

    vec4 object = texture2D(iCellGridTexture, gridUv);
    if (!cellIsValid(object)) {
        discard;
    } else {
        gl_FragColor = cellColor(object);
    }
}