import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 93;

const getFramePath = (index: number): string => {
    return `/assets/robot_seq/robot-full_${index.toString().padStart(3, '0')}.jpg`;
};

interface CalloutData {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    x: number;
    y: number;
}

const CALLOUT_DATA: CalloutData[] = [
    {
        id: '1',
        title: '3D Animation',
        description: 'CREATED COMMERCIAL AND WALKTHROUGH PROCESS VIDEOS IN BLENDER FOR DENTAL BRAND AND SURGICAL PROCEDURES.',
        imageUrl: '/assets/media/animation.png',
        x: 400,
        y: 350,
    },
    {
        id: '2',
        title: 'CAD/CAM Modeling',
        description: 'PRECISION ENGINEERING AND TECHNICAL MODELING FOR MANUFACTURING, PROTOTYPING, AND COMPLEX ASSEMBLY.',
        imageUrl: '/assets/media/cad.png',
        x: 1000,
        y: 250,
    },
    {
        id: '3',
        title: 'AI & REINFORCED LEARNING',
        description: 'DEVELOPING SCALABLE AI SOLUTIONS AND INTELLIGENT SYSTEMS WITH A FOCUS ON ROBUST ARCHITECTURE AND PERFORMANCE.',
        imageUrl: '/assets/media/programming.png',
        x: 500,
        y: 650,
    },
    {
        id: '4',
        title: 'VAPT & AUDITING',
        description: 'HANDS ON EXPERIENCE IN VAPT & AUDITING TO PROTECT DIGITAL FRONTIERS WITH ADVANCED SECURITY PROTOCOLS.',
        imageUrl: '/assets/media/cybersecurity.png',
        x: 1100,
        y: 700,
    },
];

interface CalloutElements {
    group: SVGGElement;
    line: SVGLineElement;
    dot: SVGCircleElement;
    ring: SVGCircleElement;
    card: HTMLDivElement;
}

export function RobotSequenceWithCallouts() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const svgLayerRef = useRef<SVGSVGElement>(null);
    const calloutContainerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const robotRef = useRef({ frame: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const svgLayer = svgLayerRef.current;
        const calloutContainer = calloutContainerRef.current;
        if (!canvas || !svgLayer || !calloutContainer) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const images: HTMLImageElement[] = [];
        let imagesLoaded = 0;

        const render = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            const img = images[Math.round(robotRef.current.frame)];
            if (img && img.complete) {
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        // Preload images
        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === 1) {
                    render();
                }
            };
            img.src = getFramePath(i);
            images.push(img);
        }

        imagesRef.current = images;

        // GSAP Scroll Animation
        gsap.to(robotRef.current, {
            frame: FRAME_COUNT - 1,
            ease: 'none',
            scrollTrigger: {
                trigger: '#section-3',
                start: 'top top',
                end: '+=3000',
                scrub: 1,
                pin: true,
            },
            onUpdate: render,
        });

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        window.addEventListener('resize', resize);
        resize();

        // Callout functions
        const createCalloutElements = (
            data: CalloutData,
            offsetX: number,
            offsetY: number,
            verticalAlign: string,
            lineTipAdjX: number,
            lineTipAdjY: number,
            originMoveX: number,
            originMoveY: number
        ): CalloutElements => {
            const startX = data.x + originMoveX;
            const startY = data.y + originMoveY;
            const endX = startX + offsetX;
            const endY = startY + offsetY;

            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('id', `svg-group-${data.id}`);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', String(startX + lineTipAdjX));
            line.setAttribute('y1', String(startY + lineTipAdjY));
            line.setAttribute('x2', String(endX));
            line.setAttribute('y2', String(endY));
            line.classList.add('callout-line', 'glow-filter');
            line.style.opacity = '0';

            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', String(startX + lineTipAdjX));
            dot.setAttribute('cy', String(startY + lineTipAdjY));
            dot.setAttribute('r', '4');
            dot.classList.add('origin-dot', 'glow-filter');

            const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ring.setAttribute('cx', String(startX + lineTipAdjX));
            ring.setAttribute('cy', String(startY + lineTipAdjY));
            ring.setAttribute('r', '8');
            ring.classList.add('origin-ring');

            group.appendChild(line);
            group.appendChild(ring);
            group.appendChild(dot);
            svgLayer.appendChild(group);

            const card = document.createElement('div');
            card.id = `card-${data.id}`;
            card.className = 'callout-box';
            card.style.left = `${endX}px`;
            card.style.top = `${endY}px`;
            card.style.transform = `translate(${offsetX > 0 ? '0%' : '-100%'}, ${verticalAlign})`;
            card.style.opacity = '0';

            card.innerHTML = `
        <div class="img-container">
          <img src="${data.imageUrl}" alt="${data.title}">
          <div class="img-gradient"></div>
        </div>
        <div class="content-part">
          <div class="stagger title-badge">
            <h3>${data.title}</h3>
          </div>
          <p class="stagger description">${data.description}</p>
          <div class="stagger read-more">
            <div class="read-more-dot"></div>
            <span>Project Link +</span>
          </div>
        </div>
      `;
            calloutContainer.appendChild(card);

            return { group, line, dot, ring, card };
        };

        const animateCallout = (
            elements: CalloutElements,
            startPos: number,
            endPos: number,
            cardOffsetX: number
        ) => {
            const tl = gsap.timeline({
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: '#section-3',
                    start: 'top top',
                    end: '+=2500',
                    scrub: 1,
                },
            });

            tl.set({}, {}, 1);

            tl.fromTo(elements.dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.1 }, startPos);
            tl.fromTo(elements.ring, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.1 }, startPos);

            gsap.to(elements.ring, { scale: 1.8, opacity: 0, duration: 1.2, repeat: -1, ease: 'power1.out' });

            const length = elements.line.getTotalLength() || 250;
            tl.set(elements.line, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 }, startPos + 0.05);
            tl.to(elements.line, { strokeDashoffset: 0, duration: 0.2, ease: 'power2.inOut' }, startPos + 0.05);

            tl.fromTo(
                elements.card,
                { opacity: 0, x: cardOffsetX },
                { opacity: 1, x: 0, duration: 0.2, ease: 'power3.out' },
                startPos + 0.1
            );

            tl.to([elements.dot, elements.ring, elements.line, elements.card], {
                opacity: 0,
                duration: 0.1,
            }, endPos);
        };

        // Create and animate all callouts
        const callout1 = createCalloutElements(CALLOUT_DATA[0], -400, -300, '0%', 50, 30, 250, -150);
        animateCallout(callout1, 0, 0.25, -20);

        const callout2 = createCalloutElements(CALLOUT_DATA[1], 0, -170, '0%', 0, 0, -150, 0);
        animateCallout(callout2, 0.5, 0.75, 20);

        const callout3 = createCalloutElements(CALLOUT_DATA[2], -450, -100, '-100%', 0, 0, 150, -300);
        animateCallout(callout3, 0.25, 0.5, -20);

        const callout4 = createCalloutElements(CALLOUT_DATA[3], -200, -50, '-100%', 0, 0, -300, -300);
        animateCallout(callout4, 0.75, 1, 20);

        return () => {
            window.removeEventListener('resize', resize);
            // Cleanup ScrollTrigger instances
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === document.querySelector('#section-3')) {
                    st.kill();
                }
            });
            // Cleanup callouts
            while (svgLayer.firstChild) {
                svgLayer.removeChild(svgLayer.firstChild);
            }
            while (calloutContainer.firstChild) {
                calloutContainer.removeChild(calloutContainer.firstChild);
            }
        };
    }, []);

    return (
        <section className="section-3" id="section-3">
            <div className="hud-grid"></div>
            <div className="robot-sequence-container">
                <canvas ref={canvasRef} id="robot-canvas"></canvas>
                <svg id="svg-layer" ref={svgLayerRef}></svg>
                <div id="callout-container" ref={calloutContainerRef}></div>
            </div>
        </section>
    );
}
