import { useEffect, useState } from 'react';

export function Footer() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Kolkata',
            };
            const timeString = now.toLocaleTimeString('en-GB', options);
            const gmtOffset = "+5:30";
            setTime(`${timeString} GMT${gmtOffset}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="footer-section">
            <div className="footer-content">
                <div className="footer-left">
                    <h2 className="footer-title">LET'S CREATE SOMETHING EXTRAORDINARY.</h2>
                    <button className="footer-cta explore-work-btn group">
                        <span className="btn-dot"></span>
                        <span className="btn-txt">GET IN TOUCH</span>
                    </button>
                </div>

                <div className="footer-right">
                    <div className="location-card">
                        <img src="/assets/media/map.png" alt="Mumbai Map" className="location-map" />
                        <div className="location-info">
                            <h3>Mumbai, IN</h3>
                            <p>{time} Local time</p>
                        </div>
                        <div className="blinking-dot-container">
                            <div className="blinking-dot"></div>
                        </div>
                    </div>

                    <div className="social-links-row">
                        <a href="https://www.linkedin.com/in/parth-kakadia/" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" title="LinkedIn">
                            <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                        <a href="https://github.com/Parth673" target="_blank" rel="noopener noreferrer" className="social-icon-btn github" title="GitHub">
                            <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </a>
                        <a href="https://huggingface.co/Parth673" target="_blank" rel="noopener noreferrer" className="social-icon-btn hugging-face" title="Hugging Face">
                            <svg viewBox="0 0 100 100"><path d="M96.1,43.2c-0.2-1.2-0.5-2.4-0.9-3.5c-0.4-1.1-1-2.2-1.7-3.2c-0.7-1-1.6-1.8-2.5-2.6c-1-0.7-2.1-1.3-3.2-1.7 c-0.8-0.3-1.6-0.5-2.4-0.6c-0.8-0.1-1.6-0.2-2.5-0.2c-0.2,0-0.4,0-0.6,0c-0.6,0-1.1-0.1-1.7-0.1c-1.3-0.2-2.6-0.3-3.9-0.5 c-1.3-0.2-2.6-0.4-3.9-0.5c-1.3-0.2-2.6-0.3-3.9-0.4c-1.3-0.1-2.6-0.1-3.9,0c-1.3,0.1-2.6,0.3-3.9,0.5 c-1.3,0.3-2.5,0.7-3.6,1.2c-0.1,0.1-0.3,0.1-0.4,0.2c-1.1,0.5-2,1.2-2.9,2c-0.9,0.8-1.6,1.7-2.2,2.7 c-0.6,1-1.1,2.1-1.4,3.2c-0.3,1.1-0.6,2.3-0.7,3.5c-0.1,1.2-0.1,2.4,0,3.6c0.1,1.2,0.4,2.4,0.7,3.5 c0.3,1.1,0.8,2.2,1.4,3.2c0.6,1,1.3,1.9,2.2,2.7c0.9,0.8,1.8,1.5,2.9,2c0.1,0.1,0.3,0.1,0.4,0.2 c1.1,0.5,2.3,0.9,3.6,1.2c1.3,0.3,2.6,0.5,3.9,0.5c1.3,0.1,2.6,0.1,3.9,0c1.3-0.1,2.6-0.3,3.9-0.4c1.3-0.2,2.6-0.4,3.9-0.5 c1.3-0.2,2.6-0.3,3.9-0.5c0.6-0.1,1.1-0.1,1.7-0.1c0.2,0,0.4,0,0.6,0c0.8,0,1.7-0.1,2.5-0.2c0.8-0.1,1.6-0.3,2.4-0.6 c1.1-0.4,2.2-1,3.2-1.7c1-0.7,1.8-1.6,2.5-2.6c0.7-1,1.3-2.1,1.7-3.2c0.4-1.1,0.7-2.3,0.9-3.5 C96.2,45.6,96.2,44.4,96.1,43.2z M45,46.5c0,2.8-2.2,5-5,5s-5-2.2-5-5s2.2-5,5-5S45,43.7,45,46.5z M65,46.5c0,2.8-2.2,5-5,5 s-5-2.2-5-5s2.2-5,5-5S65,43.7,65,46.5z M45,67c0,0.6-0.4,1-1,1c-0.6,0-1,0.4-1,1c0,1.1,0.9,2,2,2s2-0.9,2-2 c0-0.6-0.4-1-1-1C45.4,68,45,67.6,45,67z M56,67c0,0.6-0.4,1-1,1c-0.6,0-1,0.4-1,1c0,1.1,0.9,2,2,2s2-0.9,2-2c0-0.6-0.4-1-1-1 C56.4,68,56,67.6,56,67z" /></svg>
                        </a>
                        <a href="https://youtube.com/@popothebird" target="_blank" rel="noopener noreferrer" className="social-icon-btn youtube" title="YouTube">
                            <svg viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                        </a>
                        <a href="https://x.com/popothebird" target="_blank" rel="noopener noreferrer" className="social-icon-btn twitter" title="Twitter">
                            <svg viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} PARTH PORTFOLIO. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
}
