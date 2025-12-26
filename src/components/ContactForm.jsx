import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const turnstileRef = useRef(null);

    // Load Turnstile script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // Render Turnstile widget when script loads
    useEffect(() => {
        const renderTurnstile = () => {
            if (window.turnstile && turnstileRef.current && !turnstileRef.current.hasChildNodes()) {
                window.turnstile.render(turnstileRef.current, {
                    sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA', // Test key for development
                    callback: (token) => {
                        setTurnstileToken(token);
                    },
                    'expired-callback': () => {
                        setTurnstileToken('');
                    },
                    theme: 'dark'
                });
            }
        };

        // Check if turnstile is already loaded
        if (window.turnstile) {
            renderTurnstile();
        } else {
            // Wait for script to load
            const checkTurnstile = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(checkTurnstile);
                    renderTurnstile();
                }
            }, 100);

            return () => clearInterval(checkTurnstile);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetTurnstile = () => {
        if (window.turnstile && turnstileRef.current) {
            window.turnstile.reset(turnstileRef.current);
            setTurnstileToken('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            setStatus({ type: 'error', message: 'Please fill in all fields.' });
            return;
        }

        if (!turnstileToken) {
            setStatus({ type: 'error', message: 'Please complete the CAPTCHA verification.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        turnstileToken
                    })
                }
            );

            const result = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' });
                setFormData({ name: '', email: '', message: '' });
                resetTurnstile();
            } else {
                setStatus({ type: 'error', message: result.error || 'Failed to send message. Please try again.' });
                resetTurnstile();
            }
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
            resetTurnstile();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            {status.message && (
                <div className={`contact-status contact-status-${status.type}`}>
                    {status.message}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    disabled={isSubmitting}
                ></textarea>
            </div>

            <div className="turnstile-container" ref={turnstileRef}></div>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
};

export default ContactForm;
