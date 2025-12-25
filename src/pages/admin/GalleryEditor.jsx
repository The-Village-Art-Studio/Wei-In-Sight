import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ImageUpload from '../../components/ImageUpload';

const GalleryEditor = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [series, setSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Editing states
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSeries, setEditingSeries] = useState(null);
    const [editingArtwork, setEditingArtwork] = useState(null);

    // Form states
    const [categoryForm, setCategoryForm] = useState({ title: '', description: '', slug: '', image_url: '' });
    const [seriesForm, setSeriesForm] = useState({ title: '', slug: '' });
    const [artworkForm, setArtworkForm] = useState({
        title: '', year: '', medium: '', dimensions: '', description: '', images: []
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchSeries(selectedCategory.id);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedSeries) {
            fetchArtworks(selectedSeries.id);
        }
    }, [selectedSeries]);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    const fetchSeries = async (categoryId) => {
        const { data, error } = await supabase
            .from('series')
            .select('*')
            .eq('category_id', categoryId)
            .order('order', { ascending: true });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setSeries(data || []);
        }
    };

    const fetchArtworks = async (seriesId) => {
        const { data, error } = await supabase
            .from('artworks')
            .select('*')
            .eq('series_id', seriesId)
            .order('order', { ascending: true });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setArtworks(data || []);
        }
    };

    // Category handlers
    const handleEditCategory = (cat) => {
        setEditingCategory(cat);
        setCategoryForm({ title: cat.title, description: cat.description || '', slug: cat.slug, image_url: cat.image_url || '' });
    };

    const resetCategoryForm = () => {
        setEditingCategory(null);
        setCategoryForm({ title: '', description: '', slug: '', image_url: '' });
    };

    const handleSubmitCategory = async (e) => {
        e.preventDefault();
        if (editingCategory) {
            const { error } = await supabase.from('categories').update(categoryForm).eq('id', editingCategory.id);
            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Category updated!' });
                resetCategoryForm();
                fetchCategories();
            }
        } else {
            const { error } = await supabase.from('categories').insert([{ ...categoryForm, order: categories.length }]);
            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Category added!' });
                resetCategoryForm();
                fetchCategories();
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure? This will also delete all series and artworks in this category.')) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Category deleted!' });
            setSelectedCategory(null);
            fetchCategories();
        }
    };

    // Series handlers
    const handleEditSeries = (s) => {
        setEditingSeries(s);
        setSeriesForm({ title: s.title, slug: s.slug });
    };

    const resetSeriesForm = () => {
        setEditingSeries(null);
        setSeriesForm({ title: '', slug: '' });
    };

    const handleSubmitSeries = async (e) => {
        e.preventDefault();
        if (!selectedCategory) return;

        if (editingSeries) {
            const { error } = await supabase.from('series').update(seriesForm).eq('id', editingSeries.id);
            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Series updated!' });
                resetSeriesForm();
                fetchSeries(selectedCategory.id);
            }
        } else {
            const { error } = await supabase.from('series').insert([{ ...seriesForm, category_id: selectedCategory.id, order: series.length }]);
            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Series added!' });
                resetSeriesForm();
                fetchSeries(selectedCategory.id);
            }
        }
    };

    const handleDeleteSeries = async (id) => {
        if (!window.confirm('Are you sure? This will also delete all artworks in this series.')) return;
        const { error } = await supabase.from('series').delete().eq('id', id);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Series deleted!' });
            setSelectedSeries(null);
            fetchSeries(selectedCategory.id);
        }
    };

    // Artwork handlers
    const handleEditArtwork = (art) => {
        setEditingArtwork(art);
        setArtworkForm({
            title: art.title,
            year: art.year || '',
            medium: art.medium || '',
            dimensions: art.dimensions || '',
            description: art.description || '',
            images: art.images || []
        });
    };

    const resetArtworkForm = () => {
        setEditingArtwork(null);
        setArtworkForm({ title: '', year: '', medium: '', dimensions: '', description: '', images: [] });
    };

    const handleSubmitArtwork = async (e) => {
        e.preventDefault();
        if (!selectedSeries) return;

        if (editingArtwork) {
            const { error } = await supabase.from('artworks').update(artworkForm).eq('id', editingArtwork.id);
            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Artwork updated!' });
                resetArtworkForm();
                fetchArtworks(selectedSeries.id);
            }
        } else {
            const { error } = await supabase.from('artworks').insert([{ ...artworkForm, series_id: selectedSeries.id, order: artworks.length }]);
            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Artwork added!' });
                resetArtworkForm();
                fetchArtworks(selectedSeries.id);
            }
        }
    };

    const handleDeleteArtwork = async (id) => {
        if (!window.confirm('Are you sure you want to delete this artwork?')) return;
        const { error } = await supabase.from('artworks').delete().eq('id', id);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Artwork deleted!' });
            fetchArtworks(selectedSeries.id);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>Gallery Manager</h1>
                <p>Manage categories, series, and artworks</p>
            </div>

            {message.text && (
                <div className={`admin-message admin-message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                {/* Categories Column */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Categories</h3>
                        {editingCategory && (
                            <button onClick={resetCategoryForm} className="admin-button admin-button-secondary">
                                Cancel
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                    ) : (
                        <div style={{ marginBottom: '1rem' }}>
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => { setSelectedCategory(cat); setSelectedSeries(null); }}
                                    style={{
                                        padding: '0.75rem',
                                        marginBottom: '0.5rem',
                                        background: selectedCategory?.id === cat.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span style={{ color: 'var(--text-color)' }}>{cat.title}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }}
                                            className="admin-button admin-button-secondary"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                                            className="admin-button admin-button-danger"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmitCategory}>
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={categoryForm.title}
                                onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Slug</label>
                            <input
                                type="text"
                                value={categoryForm.slug}
                                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                                placeholder="e.g., artwork"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Description</label>
                            <textarea
                                value={categoryForm.description}
                                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                style={{ minHeight: '80px' }}
                            />
                        </div>
                        <ImageUpload
                            label="Category Cover Image"
                            currentImageUrl={categoryForm.image_url}
                            onUpload={(url) => setCategoryForm({ ...categoryForm, image_url: url })}
                        />
                        <button type="submit" className="admin-button admin-button-primary" style={{ width: '100%' }}>
                            {editingCategory ? 'Update Category' : 'Add Category'}
                        </button>
                    </form>
                </div>

                {/* Series Column */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Series {selectedCategory && `(${selectedCategory.title})`}</h3>
                        {editingSeries && (
                            <button onClick={resetSeriesForm} className="admin-button admin-button-secondary">
                                Cancel
                            </button>
                        )}
                    </div>

                    {!selectedCategory ? (
                        <p style={{ color: 'var(--text-muted)' }}>Select a category first</p>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                {series.map(s => (
                                    <div
                                        key={s.id}
                                        onClick={() => setSelectedSeries(s)}
                                        style={{
                                            padding: '0.75rem',
                                            marginBottom: '0.5rem',
                                            background: selectedSeries?.id === s.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span style={{ color: 'var(--text-color)' }}>{s.title}</span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditSeries(s); }}
                                                className="admin-button admin-button-secondary"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteSeries(s.id); }}
                                                className="admin-button admin-button-danger"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSubmitSeries}>
                                <div className="admin-form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={seriesForm.title}
                                        onChange={(e) => setSeriesForm({ ...seriesForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Slug</label>
                                    <input
                                        type="text"
                                        value={seriesForm.slug}
                                        onChange={(e) => setSeriesForm({ ...seriesForm, slug: e.target.value })}
                                        placeholder="e.g., paintings"
                                        required
                                    />
                                </div>
                                <button type="submit" className="admin-button admin-button-primary" style={{ width: '100%' }}>
                                    {editingSeries ? 'Update Series' : 'Add Series'}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Artworks Column */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Artworks {selectedSeries && `(${selectedSeries.title})`}</h3>
                        {editingArtwork && (
                            <button onClick={resetArtworkForm} className="admin-button admin-button-secondary">
                                Cancel
                            </button>
                        )}
                    </div>

                    {!selectedSeries ? (
                        <p style={{ color: 'var(--text-muted)' }}>Select a series first</p>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                                {artworks.map(art => (
                                    <div
                                        key={art.id}
                                        style={{
                                            padding: '0.75rem',
                                            marginBottom: '0.5rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <span style={{ color: 'var(--text-color)' }}>{art.title}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                                                ({art.year})
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEditArtwork(art)}
                                                className="admin-button admin-button-secondary"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteArtwork(art.id)}
                                                className="admin-button admin-button-danger"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSubmitArtwork}>
                                <div className="admin-form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={artworkForm.title}
                                        onChange={(e) => setArtworkForm({ ...artworkForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div className="admin-form-group">
                                        <label>Year</label>
                                        <input
                                            type="number"
                                            value={artworkForm.year}
                                            onChange={(e) => setArtworkForm({ ...artworkForm, year: e.target.value })}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>Medium</label>
                                        <input
                                            type="text"
                                            value={artworkForm.medium}
                                            onChange={(e) => setArtworkForm({ ...artworkForm, medium: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="admin-form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={artworkForm.description}
                                        onChange={(e) => setArtworkForm({ ...artworkForm, description: e.target.value })}
                                        style={{ minHeight: '80px' }}
                                    />
                                </div>
                                <div className="artwork-images-manager" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Artwork Images</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                        {artworkForm.images.map((img, idx) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <img src={img} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => setArtworkForm({ ...artworkForm, images: artworkForm.images.filter((_, i) => i !== idx) })}
                                                    style={{
                                                        position: 'absolute', top: '-8px', right: '-8px',
                                                        background: '#ff4d4d', color: 'white', border: 'none',
                                                        borderRadius: '50%', width: '18px', height: '18px',
                                                        fontSize: '12px', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        padding: '0', line_height: '1', zIndex: '1'
                                                    }}
                                                >×</button>
                                            </div>
                                        ))}
                                    </div>
                                    <ImageUpload
                                        onUpload={(url) => setArtworkForm({ ...artworkForm, images: [...artworkForm.images, url] })}
                                        label="Add Artwork Image"
                                    />
                                </div>
                                <button type="submit" className="admin-button admin-button-primary" style={{ width: '100%' }}>
                                    {editingArtwork ? 'Update Artwork' : 'Add Artwork'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryEditor;
