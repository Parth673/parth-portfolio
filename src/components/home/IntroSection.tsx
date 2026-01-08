import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function IntroSection() {
    useEffect(() => {
        // Big statement reveal animation
        gsap.to('.big-statement', {
            scrollTrigger: {
                trigger: '.intro',
                start: 'top 70%',
                end: 'bottom 70%',
                toggleActions: 'play none none reverse',
            },
            opacity: 1,
        });

        // SVG Line Drawing Animation
        const introLinePath = document.querySelector('#intro-line-path') as SVGPathElement;
        const introLineSvg = document.querySelector('.intro-line-background') as SVGElement;

        if (introLinePath && introLineSvg) {
            const setSvgWidth = () => {
                // Make SVG line much bigger - 100% of viewport width with scale
                const svgWidth = Math.min(window.innerWidth * 1.2, 1200);
                const scale = svgWidth / 700; // Scale based on original viewBox
                introLineSvg.setAttribute('width', String(svgWidth));
                introLineSvg.setAttribute('height', String(324 * scale));
            };

            setSvgWidth();
            window.addEventListener('resize', setSvgWidth);

            const pathLength = introLinePath.getTotalLength();
            introLinePath.style.strokeDasharray = String(pathLength);
            introLinePath.style.strokeDashoffset = String(pathLength);

            gsap.to(introLinePath, {
                strokeDashoffset: 0,
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: '.intro-line-container',
                    start: 'top 80%',
                    end: 'bottom 50%',
                    scrub: 1.5,
                },
            });

            return () => {
                window.removeEventListener('resize', setSvgWidth);
            };
        }
    }, []);

    return (
        <>
            {/* SVG Line Animation Container */}
            <div className="intro-line-container">
                <svg
                    id="intro-line-svg"
                    className="intro-line-background"
                    width="700"
                    height="324"
                    viewBox="0 0 700 324"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        id="intro-line-path"
                        d="M7.50006 7.50008C168.5 12.5001 192.184 145.5 186.5 181.5C175.132 253.5 83.0001 240.008 83.0001 176C83.0001 133.5 110.478 85.2049 213 91.5001C343 99.4825 415.5 251 485.5 186C515.979 157.698 560.543 168.352 568.5 234C576.5 300 602.5 336.5 692.5 304.5"
                        stroke="#EF713B"
                        strokeWidth="15"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Intro Section */}
            <section className="intro">
                <p className="big-statement reveal-text">
                    Precision modeling and expressive animation to visualize ideas before they become reality.
                </p>
            </section>
        </>
    );
}
