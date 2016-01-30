#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D cellGridTexture;
uniform vec2 cellGridSize;

float get(vec2 offset) {
    return texture2D(cellGridTexture, (gl_FragCoord.xy + offset) / cellGridSize).r;
}

bool approx(float a, float b) {
    return abs(a - b) < 0.001;
}

void main() {
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