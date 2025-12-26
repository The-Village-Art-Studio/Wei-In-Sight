import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ArtworkDetail.css';
import { supabase } from '../lib/supabaseClient';
import SEOHead from '../components/SEOHead';
import { generateArtworkSchema, generateBreadcrumbSchema } from '../utils/structuredData';

// Helper function to extract YouTube video ID
const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Fallback data removed or moved to default initialization

const ArtworkDetail = () => {
    const { artworkId, categoryId } = useParams();
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const nextSlide = (e) => {
        if (e) e.stopPropagation();
        if (!artwork?.images) return;
        setCurrentSlide((prev) => (prev === artwork.images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = (e) => {
        if (e) e.stopPropagation();
        if (!artwork?.images) return;
        setCurrentSlide((prev) => (prev === 0 ? artwork.images.length - 1 : prev - 1));
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
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

    // Generate SEO schemas
    const artworkSchema = [
        generateArtworkSchema(artwork, { slug: categoryId }),
        generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Gallery', url: `/#gallery` },
            { name: artwork.title }
        ])
    ];

    return (
        <div className="artwork-detail-page">
            <SEOHead
                title={artwork.title}
                description={artwork.description || `${artwork.title} by Jacky (Wei) Ho - ${artwork.medium || 'Mixed Media'}, ${artwork.year || ''}`}
                image={artwork.images?.[0]}
                url={`/gallery/${categoryId}/artwork/${artworkId}`}
                schema={artworkSchema}
            />
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="artwork-container">
                {/* Left: Slider */}
                <div className="artwork-slider" onClick={toggleModal} style={{ cursor: 'zoom-in' }}>
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

                    {/* Video Section */}
                    {artwork.video_url && (
                        <div className="artwork-video-section" style={{ marginTop: '2rem' }}>
                            <h3 className="artwork-description-header">Video</h3>
                            {getYouTubeId(artwork.video_url) ? (
                                <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeId(artwork.video_url)}`}
                                        title="Artwork Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    />
                                </div>
                            ) : (
                                <video
                                    controls
                                    style={{ width: '100%', borderRadius: '8px' }}
                                >
                                    <source src={artwork.video_url} />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Gallery */}
            {isModalOpen && images.length > 0 && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <button className="modal-close" onClick={toggleModal}>×</button>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[currentSlide]}
                            alt={`${artwork.title} full view`}
                            className="modal-image"
                        />
                        {images.length > 1 && (
                            <>
                                <button className="modal-btn prev" onClick={prevSlide}>‹</button>
                                <button className="modal-btn next" onClick={nextSlide}>›</button>
                            </>
                        )}
                        <div className="modal-counter">
                            {currentSlide + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtworkDetail;
