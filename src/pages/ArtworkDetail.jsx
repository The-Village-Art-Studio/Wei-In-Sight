import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ArtworkDetail.css';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

// Fallback data removed or moved to default initialization

const ArtworkDetail = () => {
    const { artworkId } = useParams();
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchArtwork = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('artworks')
                    .select('*')
                    .eq('id', artworkId)
                    .single();

                if (error) throw error;
                setArtwork(data);
            } catch (err) {
                console.error('Error fetching artwork:', err);
            } finally {
                setLoading(false);
            }
        };

        if (artworkId) {
            fetchArtwork();
        }
    }, [artworkId]);

    const nextSlide = () => {
        if (!artwork?.images) return;
        setCurrentSlide((prev) => (prev === artwork.images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        if (!artwork?.images) return;
        setCurrentSlide((prev) => (prev === 0 ? artwork.images.length - 1 : prev - 1));
    };

    if (loading) {
        return (
            <div className="artwork-detail-page loading-detail">
                <div className="loading-spinner"></div>
                <p>Loading artwork details...</p>
            </div>
        );
    }

    if (!artwork) {
        return (
            <div className="artwork-detail-page empty-detail">
                <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                <p>Artwork not found.</p>
            </div>
        );
    }

    const images = artwork.images || [];

    return (
        <div className="artwork-detail-page">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="artwork-container">
                {/* Left: Slider */}
                <div className="artwork-slider">
                    <div className="slider-wrapper">
                        {images.length > 0 ? (
                            <img
                                src={images[currentSlide]}
                                alt={`${artwork.title} - View ${currentSlide + 1}`}
                                className="slider-image"
                            />
                        ) : (
                            <div className="no-image-placeholder">No images available</div>
                        )}

                        {images.length > 1 && (
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
                        {artwork.medium}{artwork.year ? `, ${artwork.year}` : ''}
                    </p>
                    {artwork.dimensions && (
                        <p className="artwork-dimensions">{artwork.dimensions}</p>
                    )}

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
