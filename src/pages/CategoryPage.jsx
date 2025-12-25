import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CategoryPage.css';

const categoryData = {
    'artwork': {
        title: 'Artwork',
        description: 'Paintings, Sculpture, Digital Art, and Mixed Media.',
        series: [
            { id: 'paintings', title: 'Paintings' },
            { id: 'sculpture', title: 'Sculpture' },
            { id: 'digital', title: 'Digital Art' },
            { id: 'mixed-media', title: 'Mixed Media' }
        ]
    },
    fashion: {
        title: 'Fashion Design',
        description: 'Avant-garde Apparel and Textiles',
        series: [
            { id: 'runway', title: 'Runway Collection' },
            { id: 'textiles', title: 'Textile Design' },
            { id: 'sketches', title: 'Design Sketches' }
        ]
    },
    'product-design': {
        title: 'Product Design',
        description: 'Industrial Design and Functional Art',
        series: [
            { id: 'industrial', title: 'Industrial Design' },
            { id: 'furniture', title: 'Furniture' },
            { id: 'prototypes', title: 'Prototypes' }
        ]
    },
    watchmaking: {
        title: 'Watchmaking',
        description: 'Mechanical Timepieces and Horology',
        series: [
            { id: 'complications', title: 'Complications' },
            { id: 'restoration', title: 'Restoration' },
            { id: 'movements', title: 'Movement Studies' }
        ]
    }
};

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const data = categoryData[categoryId] || { title: 'Unknown Category', description: '' };

    const handleBackClick = (e) => {
        e.preventDefault();
        navigate('/');
        setTimeout(() => {
            const element = document.querySelector('#gallery');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleScrollToSeries = (id) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset for fixed navbar + extra breathing room
            const y = element.getBoundingClientRect().top + window.pageYOffset - 150;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="category-page">
            <div className="category-header">
                <a href="/#gallery" onClick={handleBackClick} className="back-link">← Back to Gallery</a>
                <h1 className="category-title">{data.title}</h1>
                <p className="category-description">{data.description}</p>
            </div>

            <div className="category-content">
                {data.series ? (
                    <>
                        <div className="series-menu sticky-menu">
                            {data.series.map((s) => (
                                <button
                                    key={s.id}
                                    className="series-tab"
                                    onClick={() => handleScrollToSeries(s.id)}
                                >
                                    {s.title}
                                </button>
                            ))}
                        </div>

                        <div className="series-sections">
                            {data.series.map((s) => (
                                <section key={s.id} id={s.id} className="series-section">
                                    <h2 className="series-title">{s.title}</h2>
                                    <div className="placeholder-grid">
                                        {[1, 2, 3, 4, 5, 6].map((item) => (
                                            <Link
                                                key={item}
                                                to={`/gallery/${categoryId}/artwork/${item}`}
                                                className="placeholder-item"
                                            >
                                                <div className="placeholder-content">
                                                    {/* Image placeholder (bg color) is handled by CSS, we just need overlay */}
                                                    <div className="placeholder-overlay">
                                                        <span className="overlay-title">Artwork Title #{item}</span>
                                                        <span className="overlay-year">2024</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <p className="placeholder-text">Gallery content for {data.title} coming soon...</p>
                        <div className="placeholder-grid">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="placeholder-item"></div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
