import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const HeroEditor = () => {
    const [settings, setSettings] = useState({
        subtitle: '',
        cta_primary_text: 'Explore Gallery',
        cta_primary_link: '#gallery',
        cta_secondary_text: 'Contact Me',
        cta_secondary_link: '#contact'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('section', 'hero');

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else if (data && data.length > 0) {
            const settingsObj = {};
            data.forEach(item => {
                settingsObj[item.key] = item.value;
            });
            setSettings(prev => ({ ...prev, ...settingsObj }));
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Upsert each setting
        const upserts = Object.entries(settings).map(([key, value]) => ({
            section: 'hero',
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
            setMessage({ type: 'success', text: 'Hero settings saved!' });
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div>
                <div className="admin-page-header">
                    <h1>Hero Section</h1>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="admin-page-header">
                <h1>Hero Section</h1>
                <p>Customize your homepage hero content</p>
            </div>

            {message.text && (
                <div className={`admin-message admin-message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="admin-card">
                <form onSubmit={handleSave}>
                    <div className="admin-form-group">
                        <label>Subtitle</label>
                        <input
                            type="text"
                            value={settings.subtitle}
                            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                            placeholder="e.g., Toronto-based multi-field artist"
                        />
                    </div>

                    <h4 style={{ color: 'var(--text-color)', marginTop: '1.5rem', marginBottom: '1rem' }}>
                        Primary Button
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="admin-form-group">
                            <label>Text</label>
                            <input
                                type="text"
                                value={settings.cta_primary_text}
                                onChange={(e) => setSettings({ ...settings, cta_primary_text: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Link</label>
                            <input
                                type="text"
                                value={settings.cta_primary_link}
                                onChange={(e) => setSettings({ ...settings, cta_primary_link: e.target.value })}
                            />
                        </div>
                    </div>

                    <h4 style={{ color: 'var(--text-color)', marginTop: '1.5rem', marginBottom: '1rem' }}>
                        Secondary Button
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="admin-form-group">
                            <label>Text</label>
                            <input
                                type="text"
                                value={settings.cta_secondary_text}
                                onChange={(e) => setSettings({ ...settings, cta_secondary_text: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Link</label>
                            <input
                                type="text"
                                value={settings.cta_secondary_link}
                                onChange={(e) => setSettings({ ...settings, cta_secondary_link: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-button admin-button-primary"
                        style={{ marginTop: '1.5rem' }}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HeroEditor;
