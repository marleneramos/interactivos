precision mediump float;

uniform float disolveValue;
uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
varying vec2 fragCoord;

void main ()
{
  vec2 uv = fragCoord / resolution.xy;
  vec4 mainTex = texture2D(iChannel0, uv);
  float noiseVal = texture2D(iChannel1, uv).r;

  float d = (2.0 * disolveValue + noiseVal) - 1.0;
  float overOne = clamp(d * 2.0, 0.0, 0.5);
  vec4 burn = texture2D(iChannel2, vec2(overOne,0.5));

  gl_FragColor = mainTex * burn;
}
