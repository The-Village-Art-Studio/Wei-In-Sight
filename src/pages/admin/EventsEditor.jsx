import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ImageUpload from '../../components/ImageUpload';

const EventsEditor = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingEvent, setEditingEvent] = useState(null);
    const [form, setForm] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        image_url: '',
        button_text: 'Event Details',
        button_link: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setEvents(data || []);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingEvent) {
            const { error } = await supabase
                .from('events')
                .update(form)
                .eq('id', editingEvent.id);

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Event updated!' });
                setEditingEvent(null);
                resetForm();
                fetchEvents();
            }
        } else {
            const { error } = await supabase
                .from('events')
                .insert([{ ...form, order: events.length }]);

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Event added!' });
                resetForm();
                fetchEvents();
            }
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setForm({
            title: event.title,
            date: event.date,
            location: event.location,
            description: event.description,
            image_url: event.image_url || '',
            button_text: event.button_text || 'Event Details',
            button_link: event.button_link || ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Event deleted!' });
            fetchEvents();
        }
    };

    const resetForm = () => {
        setForm({ title: '', date: '', location: '', description: '', image_url: '', button_text: 'Event Details', button_link: '' });
        setEditingEvent(null);
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>Events Manager</h1>
                <p>Manage upcoming shows and exhibitions</p>
            </div>

            {message.text && (
                <div className={`admin-message admin-message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Form */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                        {editingEvent && (
                            <button onClick={resetForm} className="admin-button admin-button-secondary">
                                Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Date</label>
                            <input
                                type="text"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                placeholder="e.g., October 15 - November 30, 2025"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
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
                            label="Poster Image"
                            currentImageUrl={form.image_url}
                            onUpload={(url) => setForm({ ...form, image_url: url })}
                        />
                        <h4 style={{ color: 'var(--text-color)', marginTop: '1.5rem', marginBottom: '1rem' }}>
                            Event Button
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                            <div className="admin-form-group">
                                <label>Button Text</label>
                                <input
                                    type="text"
                                    value={form.button_text}
                                    onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                                    placeholder="Event Details"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Button Link</label>
                                <input
                                    type="text"
                                    value={form.button_link}
                                    onChange={(e) => setForm({ ...form, button_link: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <button type="submit" className="admin-button admin-button-primary" style={{ width: '100%' }}>
                            {editingEvent ? 'Update Event' : 'Add Event'}
                        </button>
                    </form>
                </div>

                {/* Events List */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>All Events</h3>
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                    ) : events.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No events yet. Add your first event!</p>
                    ) : (
                        <div>
                            {events.map(event => (
                                <div
                                    key={event.id}
                                    style={{
                                        padding: '1rem',
                                        marginBottom: '0.75rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ color: 'var(--text-color)', marginBottom: '0.25rem' }}>{event.title}</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{event.date}</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>📍 {event.location}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="admin-button admin-button-secondary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="admin-button admin-button-danger"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventsEditor;
