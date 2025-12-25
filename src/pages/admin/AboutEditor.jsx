import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ImageUpload from '../../components/ImageUpload';

const AboutEditor = () => {
    const [settings, setSettings] = useState({
        title: '',
        subtitle: '',
        artist_image_url: '',
        bio_paragraph_1: '',
        bio_paragraph_2: '',
        bio_paragraph_3: ''
    });
    const [exhibitions, setExhibitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [exhibitionForm, setExhibitionForm] = useState({ date: '', title: '' });
    const [editingExhibition, setEditingExhibition] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        // Fetch settings
        const { data: settingsData } = await supabase
            .from('site_settings')
            .select('*')
            .eq('section', 'about');

        if (settingsData && settingsData.length > 0) {
            const settingsObj = {};
            settingsData.forEach(item => {
                settingsObj[item.key] = item.value;
            });
            setSettings(prev => ({ ...prev, ...settingsObj }));
        }

        // Fetch exhibitions
        const { data: exhibitionsData, error } = await supabase
            .from('exhibitions')
            .select('*')
            .order('order', { ascending: true });

        if (!error && exhibitionsData) {
            setExhibitions(exhibitionsData);
        }

        setLoading(false);
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);

        const upserts = Object.entries(settings).map(([key, value]) => ({
            section: 'about',
            key,
            value,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('site_settings')
            .upsert(upserts, { onConflict: 'section,key' });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'About settings saved!' });
        }
        setSaving(false);
    };

    const handleEditExhibition = (ex) => {
        setEditingExhibition(ex);
        setExhibitionForm({ date: ex.date, title: ex.title });
    };

    const resetExhibitionForm = () => {
        setEditingExhibition(null);
        setExhibitionForm({ date: '', title: '' });
    };

    const handleSubmitExhibition = async (e) => {
        e.preventDefault();
        if (editingExhibition) {
            const { error } = await supabase
                .from('exhibitions')
                .update(exhibitionForm)
                .eq('id', editingExhibition.id);
            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Exhibition updated!' });
                resetExhibitionForm();
                fetchData();
            }
        } else {
            const { error } = await supabase
                .from('exhibitions')
                .insert([{ ...exhibitionForm, order: exhibitions.length }]);
            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Exhibition added!' });
                resetExhibitionForm();
                fetchData();
            }
        }
    };

    const handleDeleteExhibition = async (id) => {
        if (!window.confirm('Delete this exhibition?')) return;

        const { error } = await supabase.from('exhibitions').delete().eq('id', id);
        if (!error) {
            setMessage({ type: 'success', text: 'Exhibition deleted!' });
            fetchData();
        }
    };

    if (loading) {
        return (
            <div>
                <div className="admin-page-header">
                    <h1>About Section</h1>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="admin-page-header">
                <h1>About Section</h1>
                <p>Edit your bio and exhibition history</p>
            </div>

            {message.text && (
                <div className={`admin-message admin-message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Bio Settings */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Bio Content</h3>
                    </div>
                    <form onSubmit={handleSaveSettings}>
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={settings.title}
                                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                placeholder="e.g., Jacky (Wei) Ho"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Subtitle</label>
                            <input
                                type="text"
                                value={settings.subtitle}
                                onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                                placeholder='e.g., The Artist Behind "Wei In Sight"'
                            />
                        </div>
                        <ImageUpload
                            label="Artist Photo"
                            currentImageUrl={settings.artist_image_url}
                            onUpload={(url) => setSettings({ ...settings, artist_image_url: url })}
                        />
                        <div className="admin-form-group">
                            <label>Bio Paragraph 1</label>
                            <textarea
                                value={settings.bio_paragraph_1}
                                onChange={(e) => setSettings({ ...settings, bio_paragraph_1: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Bio Paragraph 2</label>
                            <textarea
                                value={settings.bio_paragraph_2}
                                onChange={(e) => setSettings({ ...settings, bio_paragraph_2: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Bio Paragraph 3</label>
                            <textarea
                                value={settings.bio_paragraph_3}
                                onChange={(e) => setSettings({ ...settings, bio_paragraph_3: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="admin-button admin-button-primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Bio'}
                        </button>
                    </form>
                </div>

                {/* Exhibitions */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Exhibitions & Projects</h3>
                        {editingExhibition && (
                            <button onClick={resetExhibitionForm} className="admin-button admin-button-secondary">
                                Cancel
                            </button>
                        )}
                    </div>

                    <div style={{ marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {exhibitions.map(ex => (
                            <div
                                key={ex.id}
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
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{ex.date}</span>
                                    <span style={{ color: 'var(--text-color)', marginLeft: '0.75rem' }}>{ex.title}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEditExhibition(ex)}
                                        className="admin-button admin-button-secondary"
                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteExhibition(ex.id)}
                                        className="admin-button admin-button-danger"
                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmitExhibition}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                            <div className="admin-form-group">
                                <label>Date</label>
                                <input
                                    type="text"
                                    value={exhibitionForm.date}
                                    onChange={(e) => setExhibitionForm({ ...exhibitionForm, date: e.target.value })}
                                    placeholder="2025.Aug"
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={exhibitionForm.title}
                                    onChange={(e) => setExhibitionForm({ ...exhibitionForm, title: e.target.value })}
                                    placeholder="Exhibition Name"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="admin-button admin-button-primary" style={{ width: '100%' }}>
                            {editingExhibition ? 'Update Exhibition' : 'Add Exhibition'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AboutEditor;
