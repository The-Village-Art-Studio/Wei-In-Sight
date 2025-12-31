import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CategoryPage.css';
import { supabase } from '../lib/supabaseClient';
import { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import { generateArtGallerySchema, generateBreadcrumbSchema } from '../utils/structuredData';

// Fallback data is kept for structure if DB is empty
const fallbackCategoryData = {
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
    // ... rest of the fallback could be here or handled in-line
};

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState(null);
    const [series, setSeries] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            setLoading(true);
            try {
                // 1. Get category by slug
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('slug', categoryId)
                    .single();

                if (catError) throw catError;
                setCategory(catData);

                // 2. Get series for this category
                const { data: seriesData, error: seriesError } = await supabase
                    .from('series')
                    .select('*')
                    .eq('category_id', catData.id)
                    .order('order', { ascending: true });

                if (seriesError) throw seriesError;
                setSeries(seriesData);

                // 3. Get artworks for all series in this category
                const seriesIds = seriesData.map(s => s.id);
                const { data: artData, error: artError } = await supabase
                    .from('artworks')
                    .select('*')
                    .in('series_id', seriesIds)
                    .order('order', { ascending: true });

                if (artError) throw artError;
                setArtworks(artData);

            } catch (err) {
                console.error('Error fetching category data:', err);
                // Fallback handled by category === null
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchCategoryData();
        }
    }, [categoryId]);

    const data = category || fallbackCategoryData[categoryId] || { title: 'Loading...', description: '' };

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

    // Generate SEO schemas
    const categorySchema = category ? [
        generateArtGallerySchema(category),
        generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: data.title, url: `/gallery/${categoryId}` }
        ])
    ] : null;

    return (
        <div className="category-page">
            {category && (
                <SEOHead
                    title={category.title}
                    description={category.description || `${category.title} collection by Jacky (Wei) Ho`}
                    image={category.image_url}
                    url={`/gallery/${categoryId}`}
                    schema={categorySchema}
                />
            )}
            <div className="category-header">
                <a href="/#gallery" onClick={handleBackClick} className="back-link">← Back to Gallery</a>
                <h1 className="category-title">{data.title}</h1>
                <p className="category-description">{data.description}</p>
            </div>

            <div className="category-content">
                {series.length > 0 ? (
                    <>
                        <div className="series-menu-wrapper">
                            <div className="series-menu sticky-menu">
                                {series.map((s) => (
                                    <button
                                        key={s.id}
                                        className="series-tab"
                                        onClick={() => handleScrollToSeries(s.id)}
                                    >
                                        {s.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="series-sections">
                            {series.map((s) => (
                                <section key={s.id} id={s.id} className="series-section">
                                    <h2 className="series-title">{s.title}</h2>
                                    <div className="artwork-grid">
                                        {artworks
                                            .filter(art => art.series_id === s.id)
                                            .map((art) => (
                                                <Link
                                                    key={art.id}
                                                    to={`/gallery/${categoryId}/artwork/${art.id}`}
                                                    className="artwork-item"
                                                >
                                                    <div className="artwork-card-content">
                                                        <img
                                                            src={art.images?.[0] || 'https://placehold.co/600x400/000000/ffffff?text=Artwork'}
                                                            alt={art.title}
                                                            className="artwork-card-img"
                                                        />
                                                        <div className="artwork-overlay">
                                                            <span className="overlay-title">{art.title}</span>
                                                            <span className="overlay-year">{art.year}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        {artworks.filter(art => art.series_id === s.id).length === 0 && (
                                            <p className="no-art-message">No artworks added to this series yet.</p>
                                        )}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </>
                ) : loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading gallery...</p>
                    </div>
                ) : (
                    <div className="empty-state">
                        <p className="placeholder-text">Gallery content for {data.title} coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
