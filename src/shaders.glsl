// TODO(ryan): Only do this if GL_ES?
precision highp float;

////////////////////////////////////////////////////////////////////////
//
//                           Helpers
//
////////////////////////////////////////////////////////////////////////

const float EPSILON = 0.0001;

// colorToFloat and floatToColor record colors as base-256 colors in a single float value

float colorToFloat(vec3 color) {
    return color.r + color.g * 256.0 + color.b * 256.0 * 256.0;
}

vec3 floatToColor(float value) {
    vec3 color;
    color.b = floor(value / (256.0 * 256.0));
    color.g = floor((value - color.b * 256.0 * 256.0) / 256.0);
    color.r = floor(value - color.b * 256.0 * 256.0 - color.g * 256.0);
    return color / 256.0;
}

bool approxEqual(float a, float b) {
    return abs(a - b) < EPSILON;
}

vec2 gridPositionToUv(vec2 position, vec2 gridSize) {
    return position / gridSize;
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

uniform sampler2D cellGridTexture;
uniform vec2 cellGridSize;

// Return the value of the grid as position gl_FragCoord.xy + offset
vec4 gridGet(vec2 offset) {
    return texture2D(cellGridTexture, gridPositionToUv(gl_FragCoord.xy + offset, cellGridSize));
}

export void fGameOfLife() {
    // For now don't do anything. Comment this out to progress Game of Life simulation.
    vec4 val = gridGet(vec2(0.0, 0.0));
    gl_FragColor = val;
    return;
}

////////////////////////////////////////////////////////////////////////
//
//                            Draw grid
//
////////////////////////////////////////////////////////////////////////

// Defined above too
// uniform sampler2D cellGridTexture;

// Width and height of cellGridTexture
uniform vec2 gridSize;
// Size of HTML canvas element
uniform vec2 canvasSize;
// Offset and size of the viewport in grid space
uniform vec2 viewportOffset;
uniform vec2 viewportSize;
// Shows some ugly markers on the canvas to aid debugging
uniform int showDebugUI;

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

void drawDebugUI(vec2 gridPoint) {
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
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        drawDebugUI(gridPoint);
        return;
    }

    vec4 object = texture2D(cellGridTexture, gridUv);

    // Each pixel is an encoded 4-tuple (isSeed, color, seedX, seedY)
    bool isSeed = approxEqual(object[0], 1.0);
    vec4 color = vec4(floatToColor(object[1]) * 255.0, 255.0);
    vec2 seedLocation = vec2(object[2], object[3]);

    if (!isSeed) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        gl_FragColor = color;
    }

    if (showDebugUI == 1) {
        drawDebugUI(gridPoint);
    }
}