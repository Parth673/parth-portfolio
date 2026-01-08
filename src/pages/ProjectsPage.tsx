import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
        title: 'NEURAL NETWORK',
        description: 'A deep learning visualization tool allowing users to interact with layers in real-time. Built to simplify complex architecture demos.',
        services: ['Pytorch', 'Three.js', 'React'],
        image: '/assets/media/projects/project1.png',
    },
    {
        title: 'ECOMMERCE V2',
        description: 'Complete overhaul of a high-traffic fashion retail platform. Focused on performance, SEO, and specific micro-interactions.',
        services: ['Next.js', 'Shopify API', 'GSAP'],
        image: '/assets/media/projects/project2.png',
    },
    {
        title: "PORTFOLIO '25",
        description: 'My personal playground for WebGL experiments and layout ideas. Winning Awwwards Site of the Day.',
        services: ['WebGL', 'GLSL', 'Blender'],
        image: '/assets/media/projects/project3.png',
    },
];

export function ProjectsPage() {
    const sectionRef = useRef<HTMLElement>(null);
    const liftContainerRef = useRef<HTMLDivElement>(null);
    const projectDetailsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        const liftContainer = liftContainerRef.current;
        const projectDetails = projectDetailsRef.current.filter(Boolean);

        if (!section || !liftContainer || projectDetails.length === 0) return;

        const totalProjects = projectDetails.length;

        // Initial State
        if (totalProjects > 0) {
            gsap.set(projectDetails[0], { autoAlpha: 1, y: 0 });
        }

        // Main Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=3000',
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        // Lift Animation
        tl.to(liftContainer, {
            yPercent: -(totalProjects - 1) * 100,
            ease: 'none',
            duration: totalProjects - 1,
        }, 0);

        // Text Animations
        projectDetails.forEach((detail, index) => {
            if (index === 0) return;

            const prevDetail = projectDetails[index - 1];
            const startTime = (index - 1) + 0.2;
            const switchTime = (index - 1) + 0.5;

            tl.to(prevDetail, {
                autoAlpha: 0,
                y: -20,
                duration: 0.3,
            }, startTime);

            tl.fromTo(detail, {
                autoAlpha: 0,
                y: 20,
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
            }, switchTime);
        });

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        <>
            <Navigation />
            <main>
                {/* Main Projects Title */}
                <div className="projects-main-header">
                    <h1 className="big-project-title">PROJECTS</h1>
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
                                                <span className="dot"></span> VIEW CASE STUDY
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
