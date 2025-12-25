import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ArtworkDetail.css';

// Mock data (Normally this would come from a comprehensive data source or API)
const artworkDatabase = {
    '1': {
        id: '1',
        title: 'Special Force',
        year: '2023',
        medium: 'Screen print and acrylic',
        dimensions: '30 x 20 x 2 in | 76.2 x 50.8 x 5.08 cm',
        edition: 'Unique',
        details: 'Includes a Certificate of Authenticity',
        images: [
            'https://placehold.co/800x1000/000000/ffffff?text=Image+1',
            'https://placehold.co/800x1000/111111/ffffff?text=Image+2',
            'https://placehold.co/800x1000/222222/ffffff?text=Image+3'
        ],
        description: 'An exploration of chaotic urban energy through mixed media.'
    },
    'default': {
        id: 'default',
        title: 'Untitled Artwork',
        year: '2024',
        medium: 'Mixed Media',
        dimensions: 'Variable dimensions',
        edition: 'Original',
        details: 'Signed by Artist',
        images: [
            'https://placehold.co/800x1000/000000/ffffff?text=Artwork+View'
        ],
        description: 'No description available.'
    }
};

const ArtworkDetail = () => {
    const { artworkId } = useParams();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const artwork = artworkDatabase[artworkId] || { ...artworkDatabase['default'], id: artworkId };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === artwork.images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? artwork.images.length - 1 : prev - 1));
    };

    return (
        <div className="artwork-detail-page">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="artwork-container">
                {/* Left: Slider */}
                <div className="artwork-slider">
                    <div className="slider-wrapper">
                        <img
                            src={artwork.images[currentSlide]}
                            alt={`${artwork.title} - View ${currentSlide + 1}`}
                            className="slider-image"
                        />

                        {artwork.images.length > 1 && (
                            <>
                                <button className="slider-btn prev" onClick={prevSlide}>‹</button>
                                <button className="slider-btn next" onClick={nextSlide}>›</button>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="artwork-info">
                    <h1 className="artwork-title">{artwork.title}</h1>
                    <p className="artwork-medium-year">
                        {artwork.medium}, {artwork.year}
                    </p>
                    <p className="artwork-dimensions">{artwork.dimensions}</p>

                    <div className="artwork-description-section">
                        <h3 className="artwork-description-header">About the artwork</h3>
                        <p className="artwork-description">{artwork.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkDetail;
