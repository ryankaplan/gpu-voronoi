// TODO(ryan): Only do this if GL_ES?
precision mediump float;

////////////////////////////////////////////////////////////////////////
//
//                           Helpers
//
////////////////////////////////////////////////////////////////////////

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

float get(vec2 offset) {
    return texture2D(cellGridTexture, (gl_FragCoord.xy + offset) / cellGridSize).r;
}

bool approx(float a, float b) {
    return abs(a - b) < 0.001;
}

export void fGameOfLife() {
    // For now don't do anything
    float val = get(vec2(0.0, 0.0));
    gl_FragColor = vec4(val, val, val, val);
    return;

    float sum = get(vec2(-1.0, -1.0)) + get(vec2(-1.0,  0.0)) +
        get(vec2(-1.0,  1.0)) + get(vec2( 0.0, -1.0)) +
        get(vec2( 0.0,  1.0)) + get(vec2( 1.0, -1.0)) +
        get(vec2( 1.0,  0.0)) + get(vec2( 1.0,  1.0));

    if (approx(sum, 3.0)) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else if (approx(sum, 2.0)) {
        float current = float(get(vec2(0.0, 0.0)));
        gl_FragColor = vec4(current, current, current, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
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

vec2 getGridPoint(vec2 fragCoord) {
    // UV co-ordinates of the pixel we're drawing in canvas space
    vec2 canvasSpaceUv = gl_FragCoord.xy / canvasSize;

    // Use that to find the grid point that we're drawing
    return viewportOffset + viewportSize * canvasSpaceUv;
}

bool validUv(vec2 uv) {
    return uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0;
}

vec4 getGridColor(vec2 fragCoord) {
    vec2 gridPoint = getGridPoint(fragCoord);

    // UV co-ordinates of the cell that we're drawing in grid-space
    vec2 gridUv = gridPoint / gridSize;

    if (!validUv(gridUv)) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    }

    vec4 texColor = texture2D(cellGridTexture, gridUv);
    if (texColor.r > 0.5) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        return vec4(1.0, 1.0, 1.0, 1.0);
    }
}

export void fDrawGrid() {
    gl_FragColor = getGridColor(gl_FragCoord.xy);

    if (showDebugUI == 1) {
        vec2 gridPoint = getGridPoint(gl_FragCoord.xy);

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
}