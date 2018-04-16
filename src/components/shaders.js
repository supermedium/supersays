AFRAME.registerShader('skyShader', {
  schema: {
    topColor: {default: 'red', type: 'color', is: 'uniform'},
    bottomColor: {default: 'green', type: 'color', is: 'uniform'},
    time: {type: 'time', is: 'uniform'}
  },
  vertexShader: [
    'varying vec3 vNormal;',
    'void main(){',
    '  vNormal = normal;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n'),

  fragmentShader: [
    'varying vec3 vNormal;',
    'uniform vec3 topColor;',
    'uniform vec3 bottomColor;',
    'uniform float time;',
    '',
    'void main() {',
    '  float a = dot(normalize(vNormal), vec3(0.0, -1.0, 0.0));',
    '  vec3 col = mix(bottomColor, topColor, vec3(a, a, a));',
    '  ',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n')
});

AFRAME.registerShader('floorShader', {
  schema: {
    pulse0: {default: 0.0, type: 'number', is: 'uniform'},
    pulse1: {default: 0.0, type: 'number', is: 'uniform'},
    pulse2: {default: 0.0, type: 'number', is: 'uniform'},
    pulse3: {default: 0.0, type: 'number', is: 'uniform'},
    floorColor: {default: 'red', type: 'color', is: 'uniform'},
    fogColor: {default: 'green', type: 'color', is: 'uniform'},
    time: {type: 'time', is: 'uniform'},
    lightPos: {type: 'vec3', default: '0 1 1', is: 'uniform'}
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main(){
      vUv = uv;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,

  fragmentShader: `
   varying vec2 vUv;
   varying vec3 vNormal;
   uniform vec3 floorColor;
   uniform vec3 fogColor;
   uniform vec3 lightPos;
   uniform float time;
   uniform float pulse0;
   uniform float pulse1;
   uniform float pulse2;
   uniform float pulse3;
   float dotsFunc(vec2 uv, float time, vec2 speed, float radius){
      uv += speed * (time / 100000.0);
      uv *= 200.0;
      float p = 1.90 - radius;
      float g = smoothstep(p - 0.01, p + 0.01, sin(uv.x) + sin(uv.y));
      return g;
    }
   void main() {
      float dprod = max(dot(normalize(lightPos), normalize(vNormal)), 0.0);
      float fog = length(vUv - 0.5) * 0.8;
      vec3 col = vec3(floorColor * dprod + fogColor * fog);
      float gridMask = clamp(1.0 - fog * 5.0, 0.0, 1.0);
      vec4 gpulse = vec4(pulse0 * gridMask * gridMask, pulse1 * gridMask * gridMask, pulse2 * gridMask * gridMask, pulse3 * gridMask * gridMask);
      vec4 gridIntensity = gpulse + 0.5;
      
      vec3 red = vec3(gridIntensity.x, 0.0, 0.0);
      vec3 blue = vec3(0.0, 0.0, gridIntensity.y);
      vec3 yellow = vec3(gridIntensity.z, gridIntensity.z, 0.0);
      vec3 green = vec3(0.0, gridIntensity.z, 0.0);

      col += red * pulse0 * 0.5;
      col += blue * pulse1 * 0.5;
      col += yellow * pulse2 * 0.5;
      col += green * pulse3 * 0.5;

    // red
      float dots = dotsFunc(vUv, time, vec2(1.0, 0.0), gpulse.x);
      col = mix(col, red * dots, dots * gridMask);
    // blue
      dots = dotsFunc(vUv, time, vec2(-0.4, 0.2), gpulse.y);
      col = mix(col, blue * dots, dots * gridMask);
    // yell
      dots = dotsFunc(vUv, time, vec2(-1.0, -0.5), gpulse.z);
      col = mix(col, yellow * dots, dots * gridMask);
    // gre
      dots = dotsFunc(vUv, time, vec2(0.1, -1.0), gpulse.w);
      col = mix(col, green * dots, dots * gridMask);
      gl_FragColor = vec4(col, 1.0);
    }
  `
});
