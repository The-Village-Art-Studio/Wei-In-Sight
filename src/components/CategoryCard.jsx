import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ title, description, link, image }) => {
    return (
        <Link to={link} className="category-card">
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
                <div className="card-arrow">→</div>
            </div>
            <div className="card-background" style={{ backgroundImage: `url(${image})` }}></div>
            <div className="card-overlay"></div>
        </Link>
    );
};

export default CategoryCard;
