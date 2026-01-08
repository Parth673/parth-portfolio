const vertexShaderSource = `
  precision mediump float;
  attribute vec3 aPosition;
  void main() {
      gl_Position = vec4(aPosition, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 iResolution;
  uniform vec2 uImageResolution;
  uniform float uProgress;
  uniform sampler2D iChannel0;

  // --- ADJUSTABLE GENIE PARAMETERS ---
  const float SQUEEZE_INTENSITY = 0.12; 
  const float WAVE_INTENSITY = 0.04;    
  const float WAVE_FREQUENCY = 6.0;    
  const float WAVE_SPEED = 12.0;       
  
  const float TARGET_X = 0.04;         // Target position (safely inside the left edge)
  const float TARGET_Y = 0.4;          // Vertical center
  const float TARGET_WIDTH = 0.35;     // Minimized size
  const float TARGET_HEIGHT = 0.5;     
  // ------------------------------------

  vec2 remap(vec2 uv, vec2 inputLow, vec2 inputHigh, vec2 outputLow, vec2 outputHigh) {
      vec2 t = (uv - inputLow) / (inputHigh - inputLow);
      return mix(outputLow, outputHigh, t);
  }

  // Helper for rounded corners on the distorted shape
  float sdRoundedBox(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      
      // uProgress: 0.0 = Minimized, 1.0 = Full Screen
      float p = sin((1.0 - uProgress) * 3.14159); 

      // 1. GENIE SQUEEZE & WAVE
      float curvature = sin(uv.x * 3.14159) * SQUEEZE_INTENSITY * p;
      float wave = sin(uv.y * WAVE_FREQUENCY + (1.0 - uProgress) * WAVE_SPEED) * WAVE_INTENSITY * p * (1.0 - uv.x);

      // 2. BOUNDARIES MAPPING
      float min_x = mix(TARGET_X, 0.0, uProgress);
      float max_x = mix(TARGET_X + TARGET_WIDTH, 1.0, uProgress);
      float base_min_y = mix(TARGET_Y, 0.0, uProgress);
      float base_max_y = mix(TARGET_Y + TARGET_HEIGHT, 1.0, uProgress);

      float final_min_y = base_min_y + curvature + wave;
      float final_max_y = base_max_y - curvature - wave;

      // 3. REMAPPING TO STICKER SPACE [0, 1]
      vec2 modUV = remap(uv, vec2(min_x, final_min_y), vec2(max_x, final_max_y), vec2(0.0), vec2(1.0));
      
      // 4. ROUNDED CORNERS (Nativly in Shader)
      // Check distance to the edges of the distorted frame [0, 1]
      // We use the modUV space to define the "box"
      vec2 boxCenter = vec2(0.5);
      vec2 boxHalfSize = vec2(0.5);
      float cornerRadius = 0.0; // Removed roundness
      
      float dist = sdRoundedBox(modUV - boxCenter, boxHalfSize, cornerRadius);
      
      // Smooth clipping
      float mask = 1.0 - smoothstep(0.0, 0.007, dist);

      if (modUV.x > 1.0 || modUV.x < 0.0 || modUV.y > 1.0 || modUV.y < 0.0 || mask <= 0.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          return;
      }

      // 5. ASPECT RATIO CORRECTION
      float containerAspect = iResolution.x / iResolution.y;
      float imageAspect = uImageResolution.x / uImageResolution.y;
      
      vec2 scale = vec2(1.0);
      if (containerAspect > imageAspect) {
          scale.y = containerAspect / imageAspect;
      } else {
          scale.x = imageAspect / containerAspect;
      }
      vec2 correctedUV = (modUV - 0.5) / scale + 0.5;

      vec4 tex = texture2D(iChannel0, correctedUV);
      gl_FragColor = vec4(tex.rgb, tex.a * mask);
  }
`;

const canvas = document.getElementById('genie-canvas');
const wrapper = document.getElementById('genie-container-box');
const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true });

if (!gl) console.error('WebGL not supported');

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const texture = gl.createTexture();
// const image = new Image();
// let imageReady = false;
// let imageRes = [1, 1];

// image.crossOrigin = 'anonymous';
// image.src = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1920&h=1080';

// image.onload = () => {
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   imageRes = [image.width, image.height];
//   imageReady = true;
// };

// --- Video Setup ---
const video = document.createElement('video');
let videoReady = false;
let videoRes = [1, 1];

video.autoplay = true;
video.muted = true;
video.loop = true;
video.playsInline = true;
video.crossOrigin = 'anonymous';
// Using a high-quality sample video
video.src = './assets/media/reel.mp4';

video.addEventListener('canplaythrough', () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    videoRes = [video.videoWidth, video.videoHeight];
    videoReady = true;
    video.play();
});

// --- GSAP & ScrollTrigger ---
gsap.registerPlugin(ScrollTrigger);
const state = { progress: 0 };

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#scroll-section",
        start: "top 50%",
        end: "bottom 80%",
        scrub: 1,
    },
    ease: "power1.inOut"
});

// Animate text out: slide up and fade
tl.to(".genie-text-content", {
    y: -300,
    opacity: 0,
    duration: 1.5,
    ease: "power2.in"
}, 0);

// Animate video expansion
tl.to(state, {
    progress: 1,
    duration: 2,
    ease: "power2.inOut"
}, 0.5); // Starts clearly as text is moving out

// --- Play Button UI Controls ---
const uiLayer = document.getElementById('video-ui-layer');

// Show/hide play button based on progress
ScrollTrigger.create({
    trigger: "#scroll-section",
    start: "top 50%",
    end: "bottom 80%",
    onUpdate: (self) => {
        // Show play button when video is nearly/fully maximized
        if (state.progress >= 0.95) {
            uiLayer.style.opacity = '1';
        } else {
            uiLayer.style.opacity = '0';
        }
    }
});

function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resize);
resize();

function animate() {
    if (!videoReady) {
        requestAnimationFrame(animate);
        return;
    }

    // Update texture with video frame
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

    // Clear
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // Set Uniforms
    gl.uniform1f(gl.getUniformLocation(program, 'uProgress'), state.progress);
    gl.uniform2f(gl.getUniformLocation(program, 'iResolution'), canvas.width, canvas.height);
    gl.uniform2f(gl.getUniformLocation(program, 'uImageResolution'), videoRes[0], videoRes[1]);
    gl.uniform1i(gl.getUniformLocation(program, 'iChannel0'), 0);

    const posLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(animate);
}

animate();
