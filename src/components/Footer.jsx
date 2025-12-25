import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="social-links">
                    <a href="https://instagram.com/weiinsight" target="_blank" rel="noopener noreferrer">Instagram</a>
                    {/* Add other social links here */}
                </div>
                <p className="copyright">
                    &copy; 2026 WEI IN SIGHT. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
