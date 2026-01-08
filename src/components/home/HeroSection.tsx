import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const groupRef = useRef<THREE.Group | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (!container) return;

        // Scene Setup
        const scene = new THREE.Scene();
        const sizes = {
            width: container.clientWidth,
            height: container.clientHeight,
        };

        const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
        camera.position.z = 20;
        scene.add(camera);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Materials
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xf87b1b,
            metalness: 0.1,
            roughness: 0.2,
            transmission: 0.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
        });

        const secondaryMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x3355ff,
            metalness: 0.3,
            roughness: 0.3,
            clearcoat: 0.5,
        });

        // Geometries
        const geometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
        const geometry2 = new THREE.CapsuleGeometry(1, 4, 4, 16);
        const geometry3 = new THREE.IcosahedronGeometry(1.2, 0);

        const group = new THREE.Group();
        scene.add(group);
        groupRef.current = group;

        // Procedural generation of cluster
        const objectCount = 15;
        const objects: THREE.Mesh[] = [];

        for (let i = 0; i < objectCount; i++) {
            let mesh: THREE.Mesh;
            const r = Math.random();
            if (r < 0.33) {
                mesh = new THREE.Mesh(geometry, material);
            } else if (r < 0.66) {
                mesh = new THREE.Mesh(geometry2, secondaryMaterial);
            } else {
                mesh = new THREE.Mesh(geometry3, material.clone());
                (mesh.material as THREE.MeshPhysicalMaterial).color.setHex(0x8844ff);
            }

            mesh.position.x = (Math.random() - 0.5) * 12;
            mesh.position.y = (Math.random() - 0.5) * 8;
            mesh.position.z = (Math.random() - 0.5) * 8;

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;

            const scale = 0.3 + Math.random() * 0.6;
            mesh.scale.set(scale, scale, scale);

            group.add(mesh);
            objects.push(mesh);
        }

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);

        const spotLight = new THREE.SpotLight(0x3355ff, 10);
        spotLight.position.set(-10, 10, -5);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 1;
        scene.add(spotLight);

        // Animations
        gsap.from(group.scale, {
            duration: 2,
            x: 1,
            y: 1,
            z: 1,
            ease: 'elastic.out(1, 0.75)',
            delay: 0.5,
        });

        gsap.to('.hero-statement', {
            duration: 1.5,
            opacity: 1,
            y: 0,
            ease: 'power3.out',
            delay: 1,
        });

        // Scroll-triggered animation
        gsap.to(group.rotation, {
            y: Math.PI * 0.5,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });

        // Resize handler
        const handleResize = () => {
            if (!container) return;
            sizes.width = container.clientWidth;
            sizes.height = container.clientHeight;
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        const clock = new THREE.Clock();
        let animationId: number;

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();

            objects.forEach((obj, i) => {
                obj.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
                obj.rotation.y += 0.003;
                obj.position.y += Math.sin(elapsedTime * 0.5 + i) * 0.001;
            });

            renderer.render(scene, camera);
            animationId = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            geometry.dispose();
            geometry2.dispose();
            geometry3.dispose();
            material.dispose();
            secondaryMaterial.dispose();
        };
    }, []);

    return (
        <section className="hero" id="hero">
            <div className="hero-header">
                <div className="hero-statement">
                    Architecting and Building intelligent, creative, and secure solutions.
                </div>
            </div>

            <div className="canvas-container">
                <canvas ref={canvasRef} id="webgl"></canvas>
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
