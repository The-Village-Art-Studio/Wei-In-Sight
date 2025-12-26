import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ImageUpload from '../../components/ImageUpload';
import DraggableList from '../../components/DraggableList';

const ShopsEditor = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingShop, setEditingShop] = useState(null);
    const [form, setForm] = useState({
        name: '',
        type: '',
        description: '',
        image_url: '',
        link: ''
    });

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('shops')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setShops(data || []);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingShop) {
            const { error } = await supabase
                .from('shops')
                .update(form)
                .eq('id', editingShop.id);

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Shop updated!' });
                setEditingShop(null);
                resetForm();
                fetchShops();
            }
        } else {
            const { error } = await supabase
                .from('shops')
                .insert([{ ...form, order: shops.length }]);

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Shop added!' });
                resetForm();
                fetchShops();
            }
        }
    };

    const handleEdit = (shop) => {
        setEditingShop(shop);
        setForm({
            name: shop.name,
            type: shop.type,
            description: shop.description,
            image_url: shop.image_url || '',
            link: shop.link
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this shop?')) return;

        const { error } = await supabase.from('shops').delete().eq('id', id);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Shop deleted!' });
            fetchShops();
        }
    };

    const handleDuplicate = async (shop) => {
        const newShop = {
            name: `${shop.name} (Copy)`,
            type: shop.type,
            description: shop.description,
            image_url: shop.image_url,
            link: shop.link,
            order: shops.length
        };

        const { error } = await supabase.from('shops').insert([newShop]);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Shop duplicated!' });
            fetchShops();
        }
    };

    const resetForm = () => {
        setForm({ name: '', type: '', description: '', image_url: '', link: '' });
        setEditingShop(null);
    };

    const handleReorder = async (reorderedShops) => {
        setShops(reorderedShops);
        const updates = reorderedShops.map((shop, index) => ({
            id: shop.id,
            order: index
        }));

        for (const update of updates) {
            await supabase.from('shops').update({ order: update.order }).eq('id', update.id);
        }
        setMessage({ type: 'success', text: 'Order updated!' });
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>Shops Manager</h1>
                <p>Manage purchase links and platforms</p>
            </div>

            {message.text && (
                <div className={`admin-message admin-message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1fr)', gap: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {/* Form */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>{editingShop ? 'Edit Shop' : 'Add New Shop'}</h3>
                        {editingShop && (
                            <button onClick={resetForm} className="admin-button admin-button-secondary">
                                Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Type</label>
                            <input
                                type="text"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                placeholder="e.g., Art Platform, Gallery"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <ImageUpload
                            label="Shop Logo"
                            currentImageUrl={form.image_url}
                            onUpload={(url) => setForm({ ...form, image_url: url })}
                        />
                        <div className="admin-form-group">
                            <label>Link</label>
                            <input
                                type="url"
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
                                placeholder="https://..."
                                required
                            />
                        </div>
                        <button type="submit" className="admin-button admin-button-primary" style={{ width: '100%' }}>
                            {editingShop ? 'Update Shop' : 'Add Shop'}
                        </button>
                    </form>
                </div>

                {/* Shops List */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>All Shops</h3>
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                    ) : shops.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No shops yet. Add your first shop!</p>
                    ) : (
                        <DraggableList
                            items={shops}
                            onReorder={handleReorder}
                            droppableId="shops-list"
                            renderItem={(shop) => (
                                <div
                                    style={{
                                        padding: '1rem',
                                        marginBottom: '0.75rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        cursor: 'grab'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ color: 'var(--text-muted)', cursor: 'grab' }}>⋮⋮</span>
                                            <div>
                                                <h4 style={{ color: 'var(--text-color)', marginBottom: '0.25rem' }}>{shop.name}</h4>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{shop.type}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(shop)}
                                                className="admin-button admin-button-secondary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDuplicate(shop)}
                                                className="admin-button admin-button-secondary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            >
                                                Duplicate
                                            </button>
                                            <button
                                                onClick={() => handleDelete(shop.id)}
                                                className="admin-button admin-button-danger"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    )}
                </div>
            </div>
        </div >
    );
};

export default ShopsEditor;
