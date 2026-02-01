import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  uniform vec4 uTargetRect; // x, y, width, height
  uniform sampler2D iChannel0;

  const float SQUEEZE_INTENSITY = 0.12; 
  const float WAVE_INTENSITY = 0.04;    
  const float WAVE_FREQUENCY = 6.0;    
  const float WAVE_SPEED = 12.0;       

  vec2 remap(vec2 uv, vec2 inputLow, vec2 inputHigh, vec2 outputLow, vec2 outputHigh) {
      vec2 t = (uv - inputLow) / (inputHigh - inputLow);
      return mix(outputLow, outputHigh, t);
  }

  float sdRoundedBox(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      float p = sin((1.0 - uProgress) * 3.14159); 

      float curvature = sin(uv.x * 3.14159) * SQUEEZE_INTENSITY * p;
      float wave = sin(uv.y * WAVE_FREQUENCY + (1.0 - uProgress) * WAVE_SPEED) * WAVE_INTENSITY * p * (1.0 - uv.x);

      float min_x = mix(uTargetRect.x, 0.0, uProgress);
      float max_x = mix(uTargetRect.x + uTargetRect.z, 1.0, uProgress);
      float base_min_y = mix(uTargetRect.y, 0.0, uProgress);
      float base_max_y = mix(uTargetRect.y + uTargetRect.w, 1.0, uProgress);

      float final_min_y = base_min_y + curvature + wave;
      float final_max_y = base_max_y - curvature - wave;

      vec2 modUV = remap(uv, vec2(min_x, final_min_y), vec2(max_x, final_max_y), vec2(0.0), vec2(1.0));
      
      vec2 boxCenter = vec2(0.5);
      vec2 boxHalfSize = vec2(0.5);
      float cornerRadius = 0.0;
      
      float dist = sdRoundedBox(modUV - boxCenter, boxHalfSize, cornerRadius);
      float mask = 1.0 - smoothstep(0.0, 0.007, dist);

      if (modUV.x > 1.0 || modUV.x < 0.0 || modUV.y > 1.0 || modUV.y < 0.0 || mask <= 0.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          return;
      }

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

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

export function GenieEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const uiLayerRef = useRef<HTMLDivElement>(null);
    const modalVideoRef = useRef<HTMLVideoElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isModalOpen) {
            document.documentElement.classList.add('video-modal-active');
            document.body.classList.add('video-modal-active');
            if (modalVideoRef.current) {
                modalVideoRef.current.play().catch(err => console.log("Auto-play blocked:", err));
            }
        } else {
            document.documentElement.classList.remove('video-modal-active');
            document.body.classList.remove('video-modal-active');
        }

        return () => {
            document.documentElement.classList.remove('video-modal-active');
            document.body.classList.remove('video-modal-active');
        };
    }, [isModalOpen]);

    const handlePlayClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };


    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        const uiLayer = uiLayerRef.current;
        if (!canvas || !wrapper) return;

        const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true });
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const texture = gl.createTexture();

        // Video Setup
        const video = document.createElement('video');
        let videoReady = false;
        let videoRes = [1, 1];

        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.src = '/assets/media/reel.mp4';

        video.addEventListener('canplaythrough', () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            videoRes = [video.videoWidth, video.videoHeight];
            videoReady = true;
            video.play();
        });

        // State for scroll progress
        const state = { progress: 0 };

        // GSAP Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                pin: "#scroll-section",
                invalidateOnRefresh: true,
                anticipatePin: 1,
            },
            onUpdate: () => {
                if (uiLayer) {
                    const isVisible = state.progress >= 0.95;
                    uiLayer.style.opacity = isVisible ? '1' : '0';
                    uiLayer.style.pointerEvents = isVisible ? 'auto' : 'none';
                }
            }
        });

        // Use lazy: false for crucial WebGL updates
        tl.to(".genie-text-content", {
            y: -300,
            opacity: 0,
            duration: 1,
            ease: "power1.in",
            lazy: false
        }, 0);

        tl.to(state, {
            progress: 1,
            duration: 2,
            ease: "power2.inOut",
            lazy: false
        }, 0.5);



        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = wrapper.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        window.addEventListener('resize', resize);
        resize();

        let animationId: number;

        const getTargetRect = () => {
            if (window.innerWidth < 1024) {
                // Mobile layout - centered box in the lower middle
                // x=0.1, y=0.35, w=0.8, h=0.5 (centered horizontally, taking 80% width)
                return [0.1, 0.35, 0.8, 0.5];
            } else {
                // Original layout - small box on the left
                return [0.04, 0.4, 0.35, 0.5];
            }
        };

        const animate = () => {
            if (!videoReady) {
                animationId = requestAnimationFrame(animate);
                return;
            }

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);

            const rect = getTargetRect();
            gl.uniform1f(gl.getUniformLocation(program, 'uProgress'), state.progress);
            gl.uniform2f(gl.getUniformLocation(program, 'iResolution'), canvas.width, canvas.height);
            gl.uniform2f(gl.getUniformLocation(program, 'uImageResolution'), videoRes[0], videoRes[1]);
            gl.uniform4f(gl.getUniformLocation(program, 'uTargetRect'), rect[0], rect[1], rect[2], rect[3]);
            gl.uniform1i(gl.getUniformLocation(program, 'iChannel0'), 0);

            const posLoc = gl.getAttribLocation(program, 'aPosition');
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Refresh to ensure accurate calculations
        ScrollTrigger.refresh();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
            video.pause();
            video.src = '';
            tl.kill(); // This kills the ScrollTrigger as well
        };
    }, []);

    return (
        <div className="scroll-container">
            <div id="scroll-section" className="genie-wrapper">
                <div className="genie-text-overlay">
                    <div className="genie-text-content space-y-8">
                        <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
                            Specializing in CAD/CAM modeling and 3D animation, I develop accurate designs and
                            simulations that support manufacturing, prototyping, and technical communication.
                        </p>
                        <button className="explore-work-btn group">
                            <span className="btn-dot"></span>
                            <span className="btn-txt">Explore Work</span>
                        </button>
                    </div>
                </div>
                <div className="genie-container" id="genie-container-box" ref={wrapperRef}>
                    <canvas ref={canvasRef} id="genie-canvas"></canvas>
                    <div className="ui-layer" id="video-ui-layer" ref={uiLayerRef}>
                        <div className="content">
                            <button
                                className="play-button"
                                id="video-play-button"
                                onClick={handlePlayClick}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="video-full-screen-overlay"
                    onClick={handleCloseModal}
                    onMouseMove={handleMouseMove}
                >
                    <video
                        ref={modalVideoRef}
                        src="/assets/media/videos/show_reel.mp4"
                        autoPlay
                        loop
                        muted={isMuted}
                        className="modal-video"
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    />

                    <div
                        className="video-custom-cursor"
                        style={{
                            left: cursorPos.x,
                            top: cursorPos.y,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </div>

                    <div className="video-timeline-container" onClick={(e) => e.stopPropagation()}>
                        <div className="timeline-labels">
                            <span className="label-play">PLAY</span>
                            <div className="timeline-track">
                                <div
                                    className="timeline-progress"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                />
                            </div>
                            <span className="label-mute" onClick={toggleMute}>
                                {isMuted ? 'UNMUTE' : 'MUTE'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
