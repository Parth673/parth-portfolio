
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

gsap.registerPlugin(ScrollTrigger);

// --- 1. Scene Setup ---
const canvasContainer = document.querySelector('.canvas-container');
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
/* Lusion often has a very clean, slightly tinted background. 
   We'll use specific CSS for background color, 
   but we can set scene background to null to see through or a color to match. */
// Match the CSS background or keep transparent
scene.background = null; // Let CSS handling strict background
// Add some fog for depth
// Fog should match the container color if we want depth blending
scene.fog = new THREE.Fog('#0d0d0d', 10, 50);

const sizes = {
    width: canvasContainer.clientWidth,
    height: canvasContainer.clientHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 15;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- 2. Objects ---

// Let's create a "Cluster" of objects that looks premium. 
// Lusion uses lots of capsule/torus shapes.
const material = new THREE.MeshPhysicalMaterial({
    color: 0xF87B1B,      // bright blue
    metalness: 0.1,
    roughness: 0.2,       // shiny
    transmission: 0.0,    // not glass
    clearcoat: 1.0,       // very clear coat
    clearcoatRoughness: 0.1,
    sheen: 0.1,
    sheenColor: 0xffffff,
});

const secondaryMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x5A7ACD,      // dark grey/black
    metalness: 0.5,
    roughness: 0.2,
    clearcoat: 1.0
});

const tertiaryMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xC9CDCF,      // dark grey/black
    metalness: 0.5,
    roughness: 0.2,
    clearcoat: 1.0
});

const geometry = new THREE.TorusGeometry(1.5, 0.6, 16, 50);
const geometry2 = new THREE.CapsuleGeometry(1, 4, 4, 16);
const geometry3 = new THREE.IcosahedronGeometry(1.2, 0);

const group = new THREE.Group();
scene.add(group);

// Procedural generation of a "cluster"
const objectCount = 15;
const objects = [];

for (let i = 0; i < objectCount; i++) {
    let mesh;
    const r = Math.random();
    if (r < 0.33) {
        mesh = new THREE.Mesh(geometry, material);
    } else if (r < 0.66) {
        mesh = new THREE.Mesh(geometry2, secondaryMaterial);
    } else {
        mesh = new THREE.Mesh(geometry3, tertiaryMaterial);
    }

    // Random Position
    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 5;

    // Random Rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;

    // Random Scale
    const s = Math.random() * 0.5 + 0.5;
    mesh.scale.set(s, s, s);

    group.add(mesh);
    objects.push({
        mesh: mesh,
        speed: Math.random() * 0.02 + 0.005,
        rotSpeed: {
            x: Math.random() * 0.02,
            y: Math.random() * 0.02
        }
    });
}

// --- 3. Light ---
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0x3355ff, 10);
spotLight.position.set(-10, 10, -5);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 1;
scene.add(spotLight);


// --- 4. Animations & ScrollTrigger ---

// Initial Animation
gsap.from(group.scale, {
    duration: 2,
    x: 1,
    y: 1,
    z: 1,
    ease: "elastic.out(1, 0.75)",
    delay: 0.5
});

gsap.to('.hero-statement', {
    duration: 1.5,
    opacity: 1,
    y: 0,
    ease: "power3.out",
    delay: 1
});

// Scroll Triggers

// 1. Rotate the whole group as we scroll
gsap.to(group.rotation, {
    x: Math.PI * 2,
    y: Math.PI * 0.5,
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

// 2. Disperse/Spread objects out in the "Intro" section
// We'll scale up the group and move camera closer
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".intro",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    }
});

tl.to(group.position, {
    z: 2,
    ease: "power1.inOut"
}, "start")
    .to(group.rotation, {
        z: Math.PI * 0.5
    }, "start");

// Animate text reveal in Intro
const textElement = document.querySelector('.big-statement');
// Split text into words/spans manually or use a simple logic for now
// We can just simple change opacity 
gsap.to('.big-statement', {
    scrollTrigger: {
        trigger: ".intro",
        start: "top 70%",
        end: "bottom 70%",
        toggleActions: "play none none reverse"
    },
    opacity: 1
});

// SVG Line Drawing Animation in Intro Section
const introLinePath = document.querySelector('#intro-line-path');
const introLineSvg = document.querySelector('.intro-line-background');

if (introLinePath && introLineSvg) {
    // Set SVG width based on window.innerWidth
    const setSvgWidth = () => {
        introLineSvg.style.width = `${window.innerWidth}px`;
    };

    // Set initial width
    setSvgWidth();

    // Update width on resize
    window.addEventListener('resize', setSvgWidth);

    // Get the total length of the path
    const pathLength = introLinePath.getTotalLength();

    // Set up the stroke-dasharray and stroke-dashoffset
    introLinePath.style.strokeDasharray = pathLength;
    introLinePath.style.strokeDashoffset = pathLength;

    // Animate the line drawing on scroll (slowed down)
    gsap.to(introLinePath, {
        strokeDashoffset: 0,
        opacity: 1,
        scrollTrigger: {
            trigger: ".intro",
            start: "top 5%",
            end: "top bottom",
            scrub: 4,
            // markers: true // Uncomment for debugging
        },
        // ease: "power1.inOut"
    });

    // Optional: Animate opacity and blur for extra effect
    // gsap.fromTo('.intro-line-background',
    //     {
    //         opacity: 1,
    //     },
    //     {
    //         opacity: 1,
    //         scrollTrigger: {
    //             trigger: ".intro",
    //             start: "top top",
    //             end: "bottom bottom",
    //             scrub: 1.5
    //         }
    //     }
    // );
}


// 3. Reel Section - Convergence
// Bring everything together into a tight shape for the "Play" button background
const tl2 = gsap.timeline({
    scrollTrigger: {
        trigger: ".reel",
        start: "top bottom",
        end: "center center",
        scrub: 1
    }
});

tl2.to(group.scale, {
    x: 0.5,
    y: 0.5,
    z: 0.5
}, "converge")
    .to(camera.position, {
        z: 10
    }, "converge");


// --- 5. Mouse Interaction ---
const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
});


// --- 6. Resize ---
window.addEventListener('resize', () => {
    // Update sizes based on container
    sizes.width = canvasContainer.clientWidth;
    sizes.height = canvasContainer.clientHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --- 7. Tick ---
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotate individual objects slightly
    objects.forEach(obj => {
        obj.mesh.rotation.x += obj.rotSpeed.x;
        obj.mesh.rotation.y += obj.rotSpeed.y;
    });

    // Parallax effect on group based on mouse
    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;

    // Smooth lerp for parallax
    group.position.x += (parallaxX - group.position.x) * 0.1;
    group.position.y += (parallaxY - group.position.y) * 0.1;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();



/*
function App() {
    return React.createElement(
        'div',
        null,
        React.createElement(GenieEffect, { imageUrl: "https://picsum.photos/200/300" })
    )
}

const container = document.getElementById('react-root');
if (container) {
    const root = createRoot(container);
    root.render(React.createElement(App));
}
*/

// --- 8. Overlay Menu Logic (Widget Style) ---
const menuBtn = document.querySelector('.menu-btn');
const overlayMenu = document.querySelector('#overlay-menu');
const menuLinks = document.querySelectorAll('.menu-link');

let isMenuOpen = false;

// Create a GSAP timeline for the menu
const menuTl = gsap.timeline({ paused: true });

menuTl.to(overlayMenu, {
    duration: 0.5,
    opacity: 1,
    y: 0,
    ease: "power3.out",
    onStart: () => overlayMenu.classList.add('active'),
    onReverseComplete: () => overlayMenu.classList.remove('active')
});

// Stagger the cards for a smooth entrance
menuTl.from(".menu-card, .newsletter-card", {
    duration: 0.4,
    y: 15,
    opacity: 0,
    stagger: 0.1,
    ease: "power2.out"
}, "-=0.3");


if (menuBtn && overlayMenu) {
    menuBtn.addEventListener('click', () => {
        if (!isMenuOpen) {
            menuTl.play();
            menuBtn.innerHTML = 'CLOSE <span class="dots"> :</span>';
            isMenuOpen = true;
        } else {
            menuTl.reverse();
            menuBtn.innerHTML = 'MENU <span class="dots">••</span>';
            isMenuOpen = false;
        }
    });
}

// GSAP Hover Animation for Menu Links
menuLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            x: 5,
            backgroundColor: "#eef1ff",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "0.8rem",
            paddingBottom: "0.8rem",
            marginTop: "-0.8rem",
            marginBottom: "-0.8rem",
            borderRadius: "12px",
            duration: 0.3,
            ease: "power2.out",
            color: "#000"
        });

        const arrow = link.querySelector('.arrow-icon');
        if (arrow) {
            gsap.to(arrow, {
                x: 0,
                opacity: 1,
                duration: 0.3
            });
        }
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            x: 0,
            backgroundColor: "transparent",
            paddingLeft: "0rem",
            paddingRight: "0rem",
            paddingTop: "0rem",
            paddingBottom: "0rem",
            marginTop: "0rem",
            marginBottom: "0rem",
            duration: 0.3,
            ease: "power2.out",
            color: "#111"
        });

        const arrow = link.querySelector('.arrow-icon');
        if (arrow) {
            gsap.to(arrow, {
                x: -10,
                opacity: 0,
                duration: 0.3
            });
        }
    });
});
