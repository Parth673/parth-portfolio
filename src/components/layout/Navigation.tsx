import { useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

interface MenuItem {
    label: string;
    path: string;
}

const menuItems: MenuItem[] = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT US', path: '#' },
    { label: 'PROJECTS', path: '/projects' },
    { label: 'CONTACT', path: '#' },
];

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        const overlayMenu = document.querySelector('.overlay-menu');
        if (!overlayMenu) return;

        if (!isMenuOpen) {
            overlayMenu.classList.add('active');
            gsap.to(overlayMenu, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out',
            });
            gsap.from('.menu-card, .newsletter-card', {
                y: 15,
                opacity: 0,
                stagger: 0.1,
                duration: 0.4,
                ease: 'power2.out',
                delay: 0.1,
            });
        } else {
            gsap.to(overlayMenu, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    overlayMenu.classList.remove('active');
                },
            });
        }
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, entering: boolean) => {
        const link = e.currentTarget;
        const arrow = link.querySelector('.arrow-icon');

        if (entering) {
            gsap.to(link, {
                x: 5,
                backgroundColor: '#eef1ff',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                duration: 0.3,
            });
            if (arrow) {
                gsap.to(arrow, { x: 0, opacity: 1, duration: 0.3 });
            }
        } else {
            gsap.to(link, {
                x: 0,
                backgroundColor: 'transparent',
                paddingLeft: '0',
                paddingRight: '0',
                duration: 0.3,
            });
            if (arrow) {
                gsap.to(arrow, { x: -10, opacity: 0, duration: 0.3 });
            }
        }
    };

    return (
        <>
            {/* Logo */}
            <div className="logo">
                <Link to="/">PARTH</Link>
            </div>

            {/* Nav Buttons */}
            <div className="nav-right">
                <button className="nav-btn chat-btn">
                    LET'S TALK <span className="dot"></span>
                </button>
                <button className="nav-btn menu-btn" onClick={toggleMenu}>
                    {isMenuOpen ? 'CLOSE :' : 'MENU ••'}
                </button>
            </div>

            {/* Overlay Menu - Sidebar Style */}
            <div className="overlay-menu" id="overlay-menu">
                <div className="menu-card">
                    <ul className="menu-list">
                        {menuItems.map((item) => (
                            <li key={item.label} className="menu-item">
                                <Link
                                    to={item.path}
                                    className="menu-link"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        document.querySelector('.overlay-menu')?.classList.remove('active');
                                    }}
                                    onMouseEnter={(e) => handleMenuLinkHover(e, true)}
                                    onMouseLeave={(e) => handleMenuLinkHover(e, false)}
                                >
                                    {item.label} <span className="arrow-icon">→</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="newsletter-card">
                    <h3>Subscribe to our newsletter</h3>
                    <div className="input-wrapper">
                        <input type="email" placeholder="Your email" />
                        <button className="submit-btn">→</button>
                    </div>
                </div>
            </div>
        </>
    );
}
