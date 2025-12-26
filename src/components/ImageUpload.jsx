import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Converts an image file to WebP format using Canvas API
 * @param {File} file - Original image file
 * @param {number} quality - WebP quality (0-1), default 0.85
 * @returns {Promise<Blob>} - WebP blob
 */
const convertToWebP = async (file, quality = 0.85) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert image to WebP'));
                    }
                },
                'image/webp',
                quality
            );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
};

const ImageUpload = ({
    onUpload,
    onMultiUpload, // New callback for multiple files: (urls: string[]) => void
    currentImageUrl,
    label,
    bucket = 'website-assets',
    multiple = false, // Enable multi-file selection
    convertWebP = true // Enable WebP conversion
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const handleUpload = async (event) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const files = Array.from(event.target.files);
            setProgress({ current: 0, total: files.length });

            const uploadedUrls = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setProgress({ current: i + 1, total: files.length });

                let fileToUpload = file;
                let fileName = '';

                // Convert to WebP if enabled and file is an image (not already WebP)
                if (convertWebP && file.type.startsWith('image/') && !file.type.includes('webp')) {
                    try {
                        const webpBlob = await convertToWebP(file);
                        fileToUpload = webpBlob;
                        fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webp`;
                    } catch (conversionError) {
                        console.warn('WebP conversion failed, uploading original:', conversionError);
                        const fileExt = file.name.split('.').pop();
                        fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                    }
                } else {
                    const fileExt = file.name.split('.').pop();
                    fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                }

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, fileToUpload, {
                        contentType: convertWebP ? 'image/webp' : file.type
                    });

                if (uploadError) {
                    throw uploadError;
                }

                const { data } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(fileName);

                uploadedUrls.push(data.publicUrl);
            }

            // Call appropriate callback
            if (multiple && onMultiUpload) {
                onMultiUpload(uploadedUrls);
            } else if (onUpload && uploadedUrls.length > 0) {
                // For single upload mode, call onUpload for each URL
                if (multiple) {
                    uploadedUrls.forEach(url => onUpload(url));
                } else {
                    onUpload(uploadedUrls[0]);
                }
            }

            // Reset file input
            event.target.value = '';
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
            setProgress({ current: 0, total: 0 });
        }
    };

    return (
        <div className="image-upload-container" style={{ margin: '1rem 0' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
                {label || 'Upload Image'}
                {convertWebP && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>(auto-converts to WebP)</span>}
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
                {currentImageUrl && !multiple && (
                    <div className="current-image-preview" style={{ position: 'relative' }}>
                        <img
                            src={currentImageUrl}
                            alt="Preview"
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <button
                            type="button"
                            onClick={() => onUpload('')}
                            style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: '#ff4d4d', color: 'white', border: 'none',
                                borderRadius: '50%', width: '20px', height: '20px',
                                fontSize: '12px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '0', lineHeight: '1', zIndex: '1',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title="Remove image"
                        >×</button>
                    </div>
                )}

                <div style={{ flex: 1 }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        multiple={multiple}
                        style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)'
                        }}
                    />
                    {uploading && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginTop: '0.5rem' }}>
                            Uploading {progress.current} of {progress.total}...
                        </p>
                    )}
                    {error && <p style={{ fontSize: '0.8rem', color: '#ff4d4d', marginTop: '0.5rem' }}>{error}</p>}
                    {multiple && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Hold Ctrl/Cmd to select multiple files
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Deletes an image from Supabase storage
 * @param {string} imageUrl - Public URL of the image
 * @param {string} bucket - Storage bucket name
 * @returns {Promise<boolean>} - Success status
 */
export const deleteImageFromStorage = async (imageUrl, bucket = 'website-assets') => {
    try {
        if (!imageUrl) return true;

        // Extract file path from URL
        // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/filename
        const urlParts = imageUrl.split('/');
        const bucketIndex = urlParts.findIndex(part => part === bucket);
        if (bucketIndex === -1) return false;

        const filePath = urlParts.slice(bucketIndex + 1).join('/');

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting image:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error deleting image:', err);
        return false;
    }
};

/**
 * Deletes multiple images from Supabase storage
 * @param {string[]} imageUrls - Array of public URLs
 * @param {string} bucket - Storage bucket name
 * @returns {Promise<boolean>} - Success status
 */
export const deleteImagesFromStorage = async (imageUrls, bucket = 'website-assets') => {
    if (!imageUrls || imageUrls.length === 0) return true;

    const results = await Promise.all(
        imageUrls.map(url => deleteImageFromStorage(url, bucket))
    );

    return results.every(result => result === true);
};

export default ImageUpload;
