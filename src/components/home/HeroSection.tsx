import { useEffect, useRef, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, ContactShadows, useEnvironment, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
// @ts-ignore
import { Model as RobotModel } from './robot';

// Preload the local HDR environment map for instantaneous rendering
const ENV_PATH = '/environments/city.hdr';
useEnvironment.preload({ files: ENV_PATH });

// ADJUSTABLE CONSTANTS
const ROBOT_CONFIG = {
    initialY: 1,           // Starting vertical position
    scrollUpDistance: 10,   // How much it moves UP on scroll
    rotationSpeedY: Math.PI * 2, // 360 degrees spin
    cameraDistance: 20,     // Distance from camera
    mouseSensitivity: 0.3,   // How much it follows mouse
};

const WORDS = ["CREATIVE", "INTELLIGENT", "SECURE"];

function ArmLoader() {
    const { active, progress } = useProgress();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!active && progress >= 100) {
            const timer = setTimeout(() => setVisible(false), 500);
            return () => clearTimeout(timer);
        } else {
            setVisible(true);
        }
    }, [active, progress]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10,
            opacity: active ? 1 : 0,
            transition: 'opacity 0.5s ease',
        }}>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 18px',
                background: 'rgba(15, 12, 41, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}>
                <div style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderTopColor: '#38bdf8',
                    borderRadius: '50%',
                    animation: 'arm-spin 0.8s linear infinite'
                }} />
                <span style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    color: '#e2e8f0',
                }}>
                    INITIALIZING 3D ARM {Math.round(progress)}%
                </span>
            </div>
            <style>{`
                @keyframes arm-spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

function RobotScene() {
    const scrollGroupRef = useRef<THREE.Group>(null);
    const mouseGroupRef = useRef<THREE.Group>(null);
    const { mouse } = useThree();

    useFrame(() => {
        if (!scrollGroupRef.current || !mouseGroupRef.current) return;

        // --- SCROLL LOGIC ---
        const scrollY = window.scrollY;
        const scrollHeight = window.innerHeight;
        const progress = Math.min(scrollY / scrollHeight, 1);

        scrollGroupRef.current.position.y = ROBOT_CONFIG.initialY + (progress * ROBOT_CONFIG.scrollUpDistance);
        scrollGroupRef.current.rotation.y = (progress * ROBOT_CONFIG.rotationSpeedY) - Math.PI / 6;

        // --- MOUSE FOLLOW LOGIC ---
        const targetRotationX = -mouse.y * ROBOT_CONFIG.mouseSensitivity;
        const targetRotationY = mouse.x * ROBOT_CONFIG.mouseSensitivity;

        mouseGroupRef.current.rotation.x = THREE.MathUtils.lerp(
            mouseGroupRef.current.rotation.x,
            targetRotationX,
            0.1
        );
        mouseGroupRef.current.rotation.y = THREE.MathUtils.lerp(
            mouseGroupRef.current.rotation.y,
            targetRotationY,
            0.1
        );
    });

    return (
        <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, ROBOT_CONFIG.cameraDistance]} fov={35} />
            <ambientLight intensity={1.5} />
            <spotLight position={[10, 10, 10]} angle={0.45} penumbra={1} intensity={2} />
            <pointLight position={[-10, -10, -5]} intensity={1} color="#3355ff" />

            <group ref={scrollGroupRef} position={[0, ROBOT_CONFIG.initialY, 0]}>
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <group ref={mouseGroupRef} scale={0.005}>
                        <RobotModel />
                    </group>
                </Float>
            </group>

            <ContactShadows
                position={[0, -4.5, 0]}
                opacity={0.4}
                scale={20}
                blur={2.5}
                far={4.5}
            />
            <Environment files={ENV_PATH} />
        </Suspense>
    );
}

export function HeroSection() {
    useEffect(() => {
        gsap.to('.hero-statement', {
            duration: 1.5,
            opacity: 1,
            y: 0,
            ease: 'power3.out',
            delay: 1,
        });
    }, []);

    // Double the words for seamless loop
    const marqueeWords = [...WORDS, ...WORDS];

    return (
        <section className="hero" id="hero">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-container {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    width: 100%;
                    transform: translateY(-50%);
                    overflow: hidden;
                    white-space: nowrap;
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0.15;
                    user-select: none;
                }
                .marquee-content {
                    display: inline-block;
                    animation: marquee 30s linear infinite;
                    font-family: 'Orbitron', sans-serif;
                    font-size: 12vw;
                    font-weight: 900;
                    color: white;
                    letter-spacing: 0.5rem;
                }
                .marquee-word {
                    display: inline-block;
                    padding: 0 4rem;
                }
                `}
            </style>

            <div className="hero-header">
                <div className="hero-statement" style={{ opacity: 0, transform: 'translateY(50px)' }}>
                    Architecting and Building intelligent, creative, and secure solutions.
                </div>
            </div>

            <div className="canvas-container" style={{
                background: 'radial-gradient(circle at 50% 1%, #948E99 -50%, #0f0c29 50%)',
                position: 'relative'
            }}>
                <ArmLoader />

                <div className="marquee-container">
                    <div className="marquee-content">
                        {marqueeWords.map((word, i) => (
                            <span key={i} className="marquee-word">{word}</span>
                        ))}
                    </div>
                </div>

                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, ROBOT_CONFIG.cameraDistance], fov: 35 }} style={{ position: 'relative', zIndex: 1 }}>
                    <RobotScene />
                </Canvas>
            </div>

            <div className="hero-footer">
                <div className="scroll-indicator">
                    <span>+</span>
                    <span>SCROLL TO EXPLORE</span>
                    <span>+</span>
                </div>
            </div>
        </section>
    );
}
