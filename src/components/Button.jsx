import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    return (
        <button className={`sci-fi-button ${variant} ${className}`} onClick={onClick}>
            <span className="button-content">{children}</span>
            <div className="button-glitch"></div>
        </button>
    );
};

export default Button;
