import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ImageUpload = ({ onUpload, currentImageUrl, label, bucket = 'website-assets' }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpload = async (event) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onUpload(data.publicUrl);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-upload-container" style={{ margin: '1rem 0' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
                {label || 'Upload Image'}
            </label>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px dashed rgba(255,255,255,0.2)'
            }}>
                {currentImageUrl && (
                    <div className="current-image-preview">
                        <img
                            src={currentImageUrl}
                            alt="Preview"
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </div>
                )}

                <div style={{ flex: 1 }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)'
                        }}
                    />
                    {uploading && <p style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginTop: '0.5rem' }}>Uploading...</p>}
                    {error && <p style={{ fontSize: '0.8rem', color: '#ff4d4d', marginTop: '0.5rem' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
