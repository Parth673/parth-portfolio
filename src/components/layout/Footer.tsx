export function Footer() {
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
                <div className="footer-links">
                    <div className="link-group">
                        <h3>SOCIAL</h3>
                        <a href="https://huggingface.co/Parth673" target="_blank" rel="noopener noreferrer">
                            HUGGINGFACE
                        </a>
                        <a href="https://github.com/Parth673" target="_blank" rel="noopener noreferrer">
                            GITHUB
                        </a>
                        <a href="https://www.linkedin.com/in/parth-kakadia/" target="_blank" rel="noopener noreferrer">
                            LINKEDIN
                        </a>
                    </div>
                    <div className="link-group">
                        <h3>LOCATION</h3>
                        <p>MUMBAI</p>
                        <p>Maharashtra, IN</p>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 PARTH PORTFOLIO. ALL RIGHTS RESERVED.</p>
                <div className="footer-logo">PARTH</div>
            </div>
        </footer>
    );
}
