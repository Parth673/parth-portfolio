import { useEffect, useRef } from 'react';
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
    image: string;
}

const PROJECTS: ProjectData[] = [
    {
        title: 'Worldcoin Globe',
        description: 'In collaboration with Tools for Humanity, we successfully integrated the dynamic Worldcoin 3D globe visualizer onto their website. Our team crafted specialized APIs, empowering the Worldcoin developer team to seamlessly activate visual effects in response to real-time user registration data.',
        services: ['API Design', '3D Design', 'WebGL'],
        image: '/assets/media/projects/project1.png',
    },
    {
        title: 'Ecommerce V2',
        description: 'Complete overhaul of a high-traffic fashion retail platform. Focused on performance, SEO, and specific micro-interactions to increase conversion rates.',
        services: ['Next.js', 'Shopify API', 'GSAP'],
        image: '/assets/media/projects/project2.png',
    },
    {
        title: "Portfolio '25",
        description: 'My personal playground for WebGL experiments and layout ideas. Winning Awwwards Site of the Day and showcasing advanced shader techniques.',
        services: ['WebGL', 'GLSL', 'Blender'],
        image: '/assets/media/projects/project3.png',
    },
];

export function ProjectsPage() {
    const sectionRef = useRef<HTMLElement>(null);
    const liftContainerRef = useRef<HTMLDivElement>(null);
    const projectDetailsRef = useRef<HTMLDivElement[]>([]);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // --- Intro Animation ---
            if (titleRef.current) {
                const typeSplit = new SplitType(titleRef.current, {
                    types: 'lines,words,chars',
                    tagName: 'span',
                });

                const introTl = gsap.timeline();

                introTl.from(typeSplit.chars, {
                    y: '100%',
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power1.inOut',
                    stagger: 0.05,
                })
                    .to(titleRef.current, {
                        x: () => {
                            const screenCenter = window.innerWidth / 2;
                            // Use optional chaining carefully or type assertion if confident
                            const el = titleRef.current;
                            if (!el) return 0;
                            const rect = el.getBoundingClientRect();
                            const elCenter = rect.left + (rect.width / 2);
                            return screenCenter - elCenter;
                        },
                        duration: 1,
                        ease: 'power3.inOut',
                        delay: 0.2
                    });
            }

            // --- Scroll Animation ---
            const section = sectionRef.current;
            const liftContainer = liftContainerRef.current;
            const projectDetails = projectDetailsRef.current.filter(Boolean);

            if (section && liftContainer && projectDetails.length > 0) {
                const totalProjects = projectDetails.length;

                // Explicitly set initial states
                gsap.set(projectDetails[0], { autoAlpha: 1, y: 0 });
                projectDetails.slice(1).forEach(el => {
                    gsap.set(el, { autoAlpha: 0, y: 20 });
                });
                gsap.set(liftContainer, { yPercent: 0 });

                const scrollTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: '+=4000',
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        snap: {
                            snapTo: 1 / (totalProjects - 1),
                            duration: { min: 0.2, max: 0.8 },
                            delay: 0,
                            ease: 'power2.inOut'
                        }
                    },
                });

                scrollTl.to(liftContainer, {
                    yPercent: -(totalProjects - 1) * 100,
                    ease: 'none',
                    duration: totalProjects - 1,
                }, 0);

                projectDetails.forEach((detail, index) => {
                    if (index === 0) return;

                    const prevDetail = projectDetails[index - 1];
                    const transitionStart = index - 0.5;

                    scrollTl.to(prevDetail, {
                        autoAlpha: 0,
                        y: -20,
                        duration: 0.4,
                        ease: 'power1.in',
                    }, transitionStart);

                    scrollTl.to(detail, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power1.out',
                    }, transitionStart + 0.4);
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Navigation />
            <main>
                {/* Main Projects Title */}
                <div className="projects-main-header">
                    <h1 className="big-project-title" ref={titleRef}>PROJECTS</h1>
                    <div className="header-meta">
                        <span className="total-count">{PROJECTS.length}</span>
                        <span className="down-arrow">↘</span>
                    </div>
                </div>

                {/* Scroll Pinned Section */}
                <section className="projects-section" id="projects-section" ref={sectionRef}>
                    <div className="projects-container">
                        {/* Left Panel: Text Info */}
                        <div className="project-info-panel">
                            <div className="info-slider-wrapper">
                                {PROJECTS.map((project, index) => (
                                    <div
                                        key={project.title}
                                        className="project-details"
                                        ref={(el) => {
                                            if (el) projectDetailsRef.current[index] = el;
                                        }}
                                    >
                                        <h3 className="project-title">{project.title}</h3>
                                        <div className="project-body-grid">
                                            <div className="desc-col">
                                                <p className="project-desc">{project.description}</p>
                                            </div>
                                            <div className="tech-col">
                                                <h4 className="tech-label">SERVICES</h4>
                                                <ul className="tech-stack">
                                                    {project.services.map((service) => (
                                                        <li key={service}>{service}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="project-btn-wrapper">
                                            <button className="project-btn">
                                                <span className="dot"></span> LAUNCH PROJECT
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Panel: Image Frame */}
                        <div className="project-visual-panel">
                            <div className="simple-image-frame">
                                <div className="image-lift-container" ref={liftContainerRef}>
                                    {PROJECTS.map((project) => (
                                        <div
                                            key={project.title}
                                            className="lift-image"
                                            style={{ backgroundImage: `url('${project.image}')` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
