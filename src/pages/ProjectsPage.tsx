import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

interface ProjectData {
    title: string;
    description: string;
    services: string[];
    recognitions: string[];
    image: string;
    date: string;
}

const PROJECTS: ProjectData[] = [
    {
        title: 'Worldcoin Globe',
        description: 'In collaboration with Tools for Humanity, we successfully integrated the dynamic Worldcoin 3D globe visualizer onto their website. Our team crafted specialized APIs, empowering the Worldcoin developer team to seamlessly activate visual effects in response to real-time user registration data.',
        services: ['API Design', '3D Design', 'WebGL'],
        recognitions: ['FWA SOTD', 'Awwwards HM'],
        image: '/assets/media/projects/project1.png',
        date: 'Oct, 23',
    },
    {
        title: 'Ecommerce V2',
        description: 'Complete overhaul of a high-traffic fashion retail platform. Focused on performance, SEO, and specific micro-interactions to increase conversion rates.',
        services: ['Next.js', 'Shopify API', 'GSAP'],
        recognitions: ['CSS Design Award', 'Best UI'],
        image: '/assets/media/projects/project2.png',
        date: 'Jan, 24',
    },
    {
        title: "Portfolio '25",
        description: 'My personal playground for WebGL experiments and layout ideas. Winning Awwwards Site of the Day and showcasing advanced shader techniques.',
        services: ['WebGL', 'GLSL', 'Blender'],
        recognitions: ['Site of the Day', 'Developer Award'],
        image: '/assets/media/projects/project3.png',
        date: 'Mar, 25',
    },
];

// Placeholder for parallax structure - typical use case involves transparent PNGs
const PARALLAX_IMAGES: Record<string, { layer1: string; layer2: string; layer3: string }> = {
    "Worldcoin Globe": {
        layer1: '/assets/media/project_1_layer1.jpg', // Back
        layer2: '/assets/media/project_1_layer2.png', // Middle
        layer3: '/assets/media/project_1_layer3.png', // Front
    }
};

export function ProjectsPage() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeDateInfo, setActiveDateInfo] = useState<{ date: string, side: 'left' | 'right' } | null>(null);

    useEffect(() => {
        // Mouse Move Parallax Logic
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Normalize coordinates -1 to 1
            const xPos = (clientX / innerWidth - 0.5) * 2;
            const yPos = (clientY / innerHeight - 0.5) * 2;

            // Animate layers
            gsap.to('.layer-1', {
                x: xPos * 10,
                y: yPos * 10,
                scale: 1.05,
                duration: 1,
                ease: 'power2.out'
            });
            gsap.to('.layer-2', {
                x: xPos * 20,
                y: yPos * 20,
                scale: 1.05,
                duration: 1,
                ease: 'power2.out'
            });
            gsap.to('.layer-3', {
                x: xPos * 30,
                y: yPos * 30,
                scale: 1.05,
                duration: 1,
                ease: 'power2.out'
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // --- Intro Title Animation ---
            if (titleRef.current) {
                const typeSplit = new SplitType(titleRef.current, {
                    types: 'lines,words,chars',
                    tagName: 'span',
                });

                gsap.from(typeSplit.chars, {
                    y: '100%',
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power1.inOut',
                    stagger: 0.05,
                });
            }

            // --- Timeline Line Animation ---
            // Animate both the line scale and the head dot position
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.timeline-section',
                    start: 'top 40%',
                    end: 'bottom 80%',
                    scrub: 1,
                }
            });

            tl.to('.timeline-line-progress', {
                height: '100%', // Use height for growing line
                ease: 'none',
            })
                .to('.timeline-head-dot', {
                    top: '100%',
                    ease: 'none',
                }, '<'); // Run at the same time

            // --- Timeline Rows Animation ---
            const rows = gsap.utils.toArray('.timeline-row') as HTMLElement[];
            rows.forEach((row, index) => {
                const contentCol = row.querySelector('.timeline-content-col');
                const visualCol = row.querySelector('.timeline-visual-col');
                const isReversed = index % 2 !== 0;

                // Update Active Date when passing this row
                // We want the "pickup" to happen when the line tip (head dot) reaches this row's center.
                // Since the line tip is animated based on section scroll, we align with that.

                ScrollTrigger.create({
                    trigger: row.querySelector('.timeline-milestone'),
                    start: 'top 45%', // Visual alignment for line tip meeting dot
                    end: 'bottom top',
                    toggleActions: 'play none none reverse',
                    onEnter: () => {
                        setActiveDateInfo({ date: PROJECTS[index].date, side: isReversed ? 'left' : 'right' });
                    },
                    onLeaveBack: () => {
                        if (index > 0) {
                            // Restore previous
                            const prevReversed = (index - 1) % 2 !== 0;
                            setActiveDateInfo({ date: PROJECTS[index - 1].date, side: prevReversed ? 'left' : 'right' });
                        } else {
                            setActiveDateInfo(null);
                        }
                    }
                });


                // Animate Content (Slide in from side + fade)
                gsap.fromTo(contentCol,
                    {
                        opacity: 0,
                        x: isReversed ? -50 : 50 // Slide in towards center
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: row,
                            start: 'top 75%',
                            end: 'top 40%',
                            scrub: 1
                        }
                    }
                );

                // Animate Visual (Scale up or Reveal)
                gsap.fromTo(visualCol,
                    {
                        opacity: 0,
                        scale: 0.9,
                        y: 50
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: row,
                            start: 'top 75%',
                            end: 'top 40%',
                            scrub: 1
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Navigation />
            <main ref={containerRef}>
                {/* Main Projects Title */}
                <div className="projects-main-header">
                    <h1 className="big-project-title" ref={titleRef}>PROJECTS</h1>
                    <div className="header-meta">
                        <span className="total-count">{PROJECTS.length}</span>
                        <span className="down-arrow">↘</span>
                    </div>
                </div>

                {/* Vertical Timeline Section */}
                <section className="timeline-section" id="projects-section">
                    <div className="timeline-line"></div>
                    <div className="timeline-line-progress"></div>
                    {/* Independent Head Dot that travels */}
                    <div className="timeline-line-container">
                        <div className="timeline-head-dot">
                            <div className={`head-dot-date-label ${activeDateInfo ? 'visible' : ''} ${activeDateInfo?.side || ''}`}>
                                {activeDateInfo?.date}
                            </div>
                        </div>
                    </div>

                    {PROJECTS.map((project) => {
                        const layers = PARALLAX_IMAGES[project.title] || {
                            layer1: project.image,
                            layer2: project.image,
                            layer3: project.image
                        };
                        return (
                            <div key={project.title} className="timeline-row">
                                {/* Text Content */}
                                <div className="timeline-content-col">
                                    <h3 className="project-title">{project.title}</h3>
                                    <div className="project-body-grid">
                                        <div className="desc-col">
                                            <p className="project-desc">{project.description}</p>
                                            <div className="project-btn-wrapper">
                                                <button className="project-btn">
                                                    <span className="dot"></span> LAUNCH PROJECT
                                                </button>
                                            </div>
                                        </div>
                                        <div className="tech-col">
                                            <div className="tech-group">
                                                <h4 className="tech-label">SERVICES</h4>
                                                <ul className="tech-stack">
                                                    {project.services.map((service) => (
                                                        <li key={service}>{service}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {project.recognitions && project.recognitions.length > 0 && (
                                                <div className="tech-group">
                                                    <h4 className="tech-label" style={{ color: '#3b82f6' }}>RECOGNITIONS</h4>
                                                    <ul className="tech-stack">
                                                        {project.recognitions.map((rec) => (
                                                            <li key={rec}>{rec}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Milestone (Center) */}
                                <div className="timeline-milestone">
                                    <div className="milestone-dot"></div>
                                </div>

                                {/* Visual Content */}
                                <div className="timeline-visual-col">
                                    <div className="timeline-visual-card">
                                        <div
                                            className="parallax-layer layer-1"
                                            style={{ backgroundImage: `url('${layers.layer1}')` }}
                                        ></div>
                                        <div
                                            className="parallax-layer layer-2"
                                            style={{ backgroundImage: `url('${layers.layer2}')` }}
                                        ></div>
                                        <div
                                            className="parallax-layer layer-3"
                                            style={{ backgroundImage: `url('${layers.layer3}')` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                <Footer />
            </main>
        </>
    );
}
