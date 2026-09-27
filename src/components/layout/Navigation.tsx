import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface MenuItem {
    label: string;
    path: string;
}

const menuItems: MenuItem[] = [
    { label: 'HOME', path: '/' },
    { label: 'PROJECTS', path: '/projects' },
    { label: 'SERVICES', path: '/#services' },
    { label: 'CONTACT', path: '#contact' },
];

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        const overlayMenu = document.querySelector('.overlay-menu');
        if (overlayMenu) {
            overlayMenu.classList.remove('active');
            gsap.set(overlayMenu, { opacity: 0, y: -20 });
        }
    }, [location.pathname]);

    // Handle ESC key to close menu
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenu();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMenuOpen]);

    const toggleMenu = () => {
        const overlayMenu = document.querySelector('.overlay-menu');
        if (!overlayMenu) return;

        if (!isMenuOpen) {
            overlayMenu.classList.add('active');
            gsap.to(overlayMenu, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power3.out',
            });
            gsap.from('.menu-card, .newsletter-card', {
                y: 15,
                opacity: 0,
                stagger: 0.08,
                duration: 0.35,
                ease: 'power2.out',
                delay: 0.05,
            });
        } else {
            gsap.to(overlayMenu, {
                opacity: 0,
                y: -15,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: () => {
                    overlayMenu.classList.remove('active');
                },
            });
        }
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        if (!isMenuOpen) return;
        const overlayMenu = document.querySelector('.overlay-menu');
        if (overlayMenu) {
            gsap.to(overlayMenu, {
                opacity: 0,
                y: -15,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: () => {
                    overlayMenu.classList.remove('active');
                },
            });
        }
        setIsMenuOpen(false);
    };

    const handleLetsTalk = () => {
        closeMenu();
        const footer = document.querySelector('.footer-section');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleHomeClick = (e: React.MouseEvent) => {
        closeMenu();
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleMenuLinkClick = (item: MenuItem, e: React.MouseEvent) => {
        closeMenu();
        if (item.path === '/' && location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (item.path === '#contact') {
            e.preventDefault();
            const footer = document.querySelector('.footer-section');
            if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (item.path === '/#services') {
            if (location.pathname === '/') {
                e.preventDefault();
                const services = document.querySelector('.our-services-wrapper') || document.querySelector('#services');
                if (services) {
                    services.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    const handleMenuLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, entering: boolean) => {
        const link = e.currentTarget;
        const arrow = link.querySelector('.arrow-icon');
        const originalText = link.querySelector('.nav-text-original');
        const cloneText = link.querySelector('.nav-text-clone');

        if (entering) {
            gsap.to(link, {
                x: 5,
                backgroundColor: '#f5ccb0',
                color: '#111',
                borderRadius: '50px',
                scale: 1.02,
                padding: '0.7rem 1.2rem',
                duration: 0.3,
                ease: 'power2.out',
            });

            // Vending machine roll effect (up)
            if (originalText && cloneText) {
                gsap.to([originalText, cloneText], {
                    y: '-100%',
                    duration: 0.4,
                    ease: 'power3.out'
                });
            }

            if (arrow) {
                gsap.to(arrow, { x: 0, opacity: 1, color: '#111', duration: 0.2 });
            }
        } else {
            gsap.to(link, {
                x: 0,
                backgroundColor: 'transparent',
                color: '#111',
                borderRadius: '12px',
                scale: 1,
                padding: '0.5rem 0.8rem',
                duration: 0.3,
                ease: 'power2.in',
            });

            // Reset roll effect (down)
            if (originalText && cloneText) {
                gsap.to([originalText, cloneText], {
                    y: '0%',
                    duration: 0.4,
                    ease: 'power3.in'
                });
            }

            if (arrow) {
                gsap.to(arrow, { x: -10, opacity: 0, color: 'inherit', duration: 0.3 });
            }
        }
    };

    return (
        <>
            {/* Backdrop for mobile when menu is open */}
            {isMenuOpen && (
                <div
                    className="menu-backdrop"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}

            {/* Logo */}
            <div className="logo">
                <Link to="/" onClick={handleHomeClick}>PARTH</Link>
            </div>

            {/* Nav Buttons */}
            <div className="nav-right">
                {/* Desktop Buttons */}
                <button
                    className="nav-btn chat-btn desktop-only"
                    onClick={handleLetsTalk}
                    type="button"
                >
                    <span className="chat-btn-text">LET'S TALK</span>
                    <span className="dot"></span>
                </button>
                <button
                    className="nav-btn menu-btn desktop-only"
                    onClick={toggleMenu}
                    type="button"
                >
                    {isMenuOpen ? 'CLOSE :' : 'MENU ••'}
                </button>

                {/* Mobile Hamburger Button */}
                <button
                    className={`nav-btn hamburger-btn mobile-only ${isMenuOpen ? 'is-active' : ''}`}
                    onClick={toggleMenu}
                    type="button"
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                >
                    <span className="hamburger-box">
                        <span className="hamburger-line line-top"></span>
                        <span className="hamburger-line line-mid"></span>
                        <span className="hamburger-line line-bot"></span>
                    </span>
                </button>
            </div>

            {/* Overlay Menu */}
            <div className="overlay-menu" id="overlay-menu">
                <div className="menu-card">
                    <ul className="menu-list">
                        {menuItems.map((item) => (
                            <li key={item.label} className="menu-item">
                                <Link
                                    to={item.path}
                                    className="menu-link"
                                    onClick={(e) => handleMenuLinkClick(item, e)}
                                    onMouseEnter={(e) => handleMenuLinkHover(e, true)}
                                    onMouseLeave={(e) => handleMenuLinkHover(e, false)}
                                >
                                    <div className="nav-text-wrapper" style={{ position: 'relative', overflow: 'hidden', height: '1.2em' }}>
                                        <span className="nav-text-original" style={{ display: 'block' }}>{item.label}</span>
                                        <span className="nav-text-clone" style={{ display: 'block', position: 'absolute', top: '100%', left: 0 }}>{item.label}</span>
                                    </div>
                                    <span className="arrow-icon">→</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="newsletter-card">
                    <h3>Reach out to team</h3>
                    <div className="input-wrapper">
                        <input type="email" placeholder="Your email" />
                        <button className="submit-btn" aria-label="Subscribe">→</button>
                    </div>
                </div>
            </div>
        </>
    );
}
