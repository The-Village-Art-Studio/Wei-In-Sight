import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavClick = (e, path) => {
        e.preventDefault();
        setIsOpen(false);

        if (path.startsWith('#')) {
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const element = document.querySelector(path);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const element = document.querySelector(path);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(path);
        }
    };

    const navLinks = [
        { path: '#home', label: 'Home' },
        { path: '#about', label: 'About' },
        { path: '#gallery', label: 'Gallery' },
        { path: '#music', label: 'Music' },
        { path: '#events', label: 'Events' },
        { path: '#purchase', label: 'Shop' },
        { path: '#contact', label: 'Contact' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={(e) => handleNavClick(e, '#home')}>
                    WEI IN SIGHT <span className="logo-dot">.</span>
                </Link>

                <div className={`menu-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>

                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.path} className="nav-item">
                            <a
                                href={link.path}
                                className="nav-links"
                                onClick={(e) => handleNavClick(e, link.path)}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
