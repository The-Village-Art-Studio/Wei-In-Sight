import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ImageUpload from '../../components/ImageUpload';

const SEOEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [seoSettings, setSeoSettings] = useState({
        site_title: 'Wei In Sight | Jacky (Wei) Ho - Contemporary Artist',
        site_description: 'Jacky (Wei) Ho - Contemporary Artist specializing in Artwork, Fashion Design, Product Design, and Watchmaking.',
        site_keywords: 'Jacky Ho, Wei Ho, contemporary artist, artwork, fashion design, product design, watchmaking',
        og_image: '',
        twitter_handle: '',
        google_verification: '',
        bing_verification: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .eq('section', 'seo');

            if (error) throw error;

            if (data && data.length > 0) {
                const settings = {};
                data.forEach(item => {
                    settings[item.key] = item.value;
                });
                setSeoSettings(prev => ({ ...prev, ...settings }));
            }
        } catch (err) {
            console.error('Error fetching SEO settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Upsert each setting
            for (const [key, value] of Object.entries(seoSettings)) {
                const { error } = await supabase
                    .from('site_settings')
                    .upsert(
                        { section: 'seo', key, value: value || '' },
                        { onConflict: 'section,key' }
                    );
                if (error) throw error;
            }
            setMessage({ type: 'success', text: 'SEO settings saved successfully!' });
        } catch (err) {
            console.error('Error saving SEO settings:', err);
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSeoSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading SEO settings...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="admin-page-header">
                <h1>SEO Settings</h1>
                <p>Manage search engine optimization and social media sharing settings</p>
            </div>

            {message.text && (
                <div className={`admin-message admin-message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="admin-columns-container">
                {/* Basic SEO Settings */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>🔍 Basic SEO</h3>
                    </div>

                    <div className="admin-form-group">
                        <label>Site Title</label>
                        <input
                            type="text"
                            value={seoSettings.site_title}
                            onChange={(e) => handleChange('site_title', e.target.value)}
                            placeholder="Wei In Sight | Jacky (Wei) Ho"
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Appears in browser tabs and search results
                        </p>
                    </div>

                    <div className="admin-form-group">
                        <label>Meta Description</label>
                        <textarea
                            value={seoSettings.site_description}
                            onChange={(e) => handleChange('site_description', e.target.value)}
                            placeholder="Describe your website in 150-160 characters..."
                            style={{ minHeight: '80px' }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {seoSettings.site_description.length}/160 characters (recommended)
                        </p>
                    </div>

                    <div className="admin-form-group">
                        <label>Keywords</label>
                        <input
                            type="text"
                            value={seoSettings.site_keywords}
                            onChange={(e) => handleChange('site_keywords', e.target.value)}
                            placeholder="keyword1, keyword2, keyword3..."
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Comma-separated list of relevant keywords
                        </p>
                    </div>
                </div>

                {/* Social Media & Sharing */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>📱 Social Sharing</h3>
                    </div>

                    <ImageUpload
                        label="Open Graph Image (1200x630px recommended)"
                        currentImageUrl={seoSettings.og_image}
                        onUpload={(url) => handleChange('og_image', url)}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: '1rem' }}>
                        Image shown when sharing on Facebook, LinkedIn, Twitter, etc.
                    </p>

                    <div className="admin-form-group">
                        <label>Twitter Handle</label>
                        <input
                            type="text"
                            value={seoSettings.twitter_handle}
                            onChange={(e) => handleChange('twitter_handle', e.target.value)}
                            placeholder="@yourhandle"
                        />
                    </div>
                </div>

                {/* Verification Codes */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>✅ Search Console Verification</h3>
                    </div>

                    <div className="admin-form-group">
                        <label>Google Search Console</label>
                        <input
                            type="text"
                            value={seoSettings.google_verification}
                            onChange={(e) => handleChange('google_verification', e.target.value)}
                            placeholder="Verification code from Google"
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Get this from Google Search Console → Settings → Ownership verification
                        </p>
                    </div>

                    <div className="admin-form-group">
                        <label>Bing Webmaster Tools</label>
                        <input
                            type="text"
                            value={seoSettings.bing_verification}
                            onChange={(e) => handleChange('bing_verification', e.target.value)}
                            placeholder="Verification code from Bing"
                        />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <button
                    onClick={handleSave}
                    className="admin-button admin-button-primary"
                    disabled={saving}
                    style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                >
                    {saving ? 'Saving...' : 'Save SEO Settings'}
                </button>
            </div>
        </div>
    );
};

export default SEOEditor;
