import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import CategoryCard from '../components/CategoryCard';
import Hero3D from '../components/Hero3D';
import './Home.css';
import './Gallery.css';
import './Music.css';
import './About.css';
import './Contact.css';
import './Events.css';
import './Purchase.css';
import artistImage from '../assets/artist.jpg';
import spotifyLogo from '../assets/spotify-logo.png';
import appleMusicLogo from '../assets/apple-music-logo.png';
import youtubeMusicLogo from '../assets/youtube-music-logo.png';
import artsyLogo from '../assets/artsy-logo.png';
import artrewardsLogo from '../assets/artrewards-logo.png';
import righttimeLogo from '../assets/righttime-logo.png';
import helloartLogo from '../assets/helloart-logo.png';
import mainLogo from '../assets/logo-white.png';

const categories = [
    {
        id: 'artwork',
        title: 'Artwork',
        description: 'Paintings, Sculpture, Digital Art, and Mixed Media.',
        link: '/gallery/artwork',
        image: 'https://placehold.co/600x400/000000/ffffff?text=Artwork'
    },
    {
        id: 'fashion',
        title: 'Fashion Design',
        description: 'Wearable art and textile engineering.',
        link: '/gallery/fashion',
        image: 'https://placehold.co/600x400/000000/ffffff?text=Fashion'
    },
    {
        id: 'product-design',
        title: 'Product Design',
        description: 'Industrial design and functional art.',
        link: '/gallery/product-design',
        image: 'https://placehold.co/600x400/000000/ffffff?text=Product+Design'
    },
    {
        id: 'watchmaking',
        title: 'Watchmaking',
        description: 'Precision mechanics and horological art.',
        link: '/gallery/watchmaking',
        image: 'https://placehold.co/600x400/000000/ffffff?text=Watchmaking'
    },
];

const tracks = [
    { id: 1, title: 'Neon Horizon', duration: '3:45' },
    { id: 2, title: 'Cybernetic Dreams', duration: '4:20' },
    { id: 3, title: 'Void Walker', duration: '3:10' },
    { id: 4, title: 'Digital Pulse', duration: '5:00' },
];

const events = [
    {
        id: 1,
        title: 'Neon Dreams Exhibition',
        date: 'October 15 - November 30, 2025',
        location: 'The Void Gallery, Toronto',
        description: 'An immersive experience featuring the latest visual art and sculpture collections.',
        image: 'https://placehold.co/400x600/000000/ffffff?text=Neon+Dreams+Poster',
        link: '#'
    },
    {
        id: 2,
        title: 'Sonic Frontiers Live',
        date: 'December 12, 2025',
        location: 'Cyber Cafe, Toronto',
        description: 'Live electronic music performance and visualizer showcase.',
        image: 'https://placehold.co/400x600/000000/ffffff?text=Sonic+Frontiers+Poster',
        link: '#'
    }
];

const shops = [
    {
        id: 1,
        name: 'Artsy Store',
        type: 'Original Art & Prints',
        description: 'Purchase original paintings, limited edition prints, and digital art licenses.',
        image: artsyLogo,
        link: '#'
    },
    {
        id: 2,
        name: 'ArtRewards',
        type: 'Online Art Platform',
        description: 'Buy original art online. Discover sculptures, paintings, and more from featured artists.',
        image: artrewardsLogo,
        link: 'https://www.artrewards.net'
    },
    {
        id: 3,
        name: 'Right Time Inc',
        type: 'Watchmaking & Service',
        description: 'Official Service Center for Graham, Edox, BALL, & Rotary. Providing expert watchmaking services in Downtown Toronto since 1999.',
        image: righttimeLogo,
        link: 'http://www.righttimeinc.com'
    },
    {
        id: 4,
        name: 'HelloArt',
        type: 'Art Platform',
        description: 'Discover and collect contemporary art from emerging and established artists.',
        image: helloartLogo,
        link: 'https://helloart.com'
    }
];

const musicPlatforms = [
    {
        id: 'spotify',
        name: 'Spotify',
        type: 'Streaming Platform',
        description: 'Listen to my latest releases, playlists, and curated soundscapes.',
        image: spotifyLogo,
        link: 'https://open.spotify.com/artist/4DebGnDY4FnrE3cy6PrWWK?si=jhoCYtahRZiN--E3p4HIfg'
    },
    {
        id: 'apple-music',
        name: 'Apple Music',
        type: 'Streaming Platform',
        description: 'Stream high-quality audio and exclusive releases on Apple Music.',
        image: appleMusicLogo,
        link: 'https://music.apple.com/ca/artist/the-prof/1733168743'
    },
    {
        id: 'youtube-music',
        name: 'YouTube Music',
        type: 'Streaming Platform',
        description: 'Watch music videos and listen to official audio tracks.',
        image: youtubeMusicLogo,
        link: 'https://music.youtube.com/channel/UCfG9SAkCC8sNDAKV5qbOSZAs'
    }
];


const exhibitions = [
    { date: '2025.Aug', title: 'TRACE Toronto by Public Display Agency' },
    { date: '2024.Oct', title: 'Union Art Crawl (Nuit blanche Toronto)​ - Panel Artist' },
    { date: '2023.Nov', title: 'RAW Artist Toronto' },
    { date: '2023.Sep', title: 'Union Art Crawl (Nuit blanche Toronto)​ - Panel Artist' },
    { date: '2021.July', title: 'BAA Gallery Berlin' },
    { date: '2020.Mar', title: 'CFDA Design Scholar Award 2020 (Representative of AAU)' },
    { date: '2016.Oct', title: 'Shanghai Fashion Week 2017 S/S' },
    { date: '2016.Feb', title: 'Art Hearts New York Fashion Week 2017 S/S' },
    { date: '2015.Oct', title: 'Vancouver Fashion Week 2016 S/S' },
    { date: '2012.Mar', title: 'Sony ACID Pro EDM Music Contest - World Top 20' }
];

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section id="home" className="hero-section">
                <div className="hero-content">
                    <div className="hero-logo-container">
                        <img src={mainLogo} alt="Wei In Sight" className="hero-logo-img" />
                    </div>
                    <p className="hero-subtitle">
                        🇨🇦 Toronto-based multi-field artist
                    </p>
                    <div className="hero-actions">
                        <a href="#gallery">
                            <Button variant="primary">Explore Gallery</Button>
                        </a>
                        <a href="#contact">
                            <Button variant="secondary">Contact Me</Button>
                        </a>
                    </div>
                </div>
                <div className="hero-visual">
                    <Hero3D />
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-page">
                <div className="about-container">
                    <div className="about-image">
                        <img src={artistImage} alt="Jacky (Wei) Ho" className="about-photo" />
                    </div>
                    <div className="about-content">
                        <h1 className="about-title">Jacky (Wei) Ho</h1>
                        <h2 className="about-subtitle">The Artist Behind "Wei In Sight"</h2>
                        <p className="about-text">
                            "Wei Ho" is the name my grandpa gave me; it means "Afraid of nothing." He used to be a Fine Art Teacher in school, so I keep using this name for my art to pay tribute to him. My full name is Jacky (Wei) Ho.
                        </p>
                        <p className="about-text">
                            "Wei In Sight" means "All my artworks will stay in everyone's sight."
                        </p>
                        <p className="about-text">
                            I am a Toronto-based multi-field artist with a passion for exploring the intersection of technology, tradition, and expression. My work spans across watchmaking, fashion design, visual arts, and music, each discipline informing the others in a continuous cycle of creativity.
                        </p>

                        <div className="exhibitions-section">
                            <h3 className="exhibitions-title">EXHIBITIONS AND PROJECTS</h3>
                            <ul className="exhibitions-list">
                                {exhibitions.map((item, index) => (
                                    <li key={index} className="exhibition-item">
                                        <span className="exhibition-date">{item.date}</span>
                                        <span className="exhibition-name">{item.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="gallery-page">
                <div className="gallery-container">
                    <div className="gallery-header">
                        <h1 className="gallery-title">Artistic Divisions</h1>
                        <p className="gallery-subtitle">Explore the multi-disciplinary works of Jacky (Wei) Ho</p>
                    </div>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} {...category} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Music Section */}
            <section id="music" className="music-page">
                <div className="music-container">
                    <h1 className="music-title">Words & Rhythm</h1>
                    <p className="music-subtitle">Experimental Soundscapes & Electronic Compositions</p>

                    <div className="music-grid">
                        {musicPlatforms.map((platform) => (
                            <a key={platform.id} href={platform.link} className="music-card">
                                <img src={platform.image} alt={platform.name} className="music-image" />
                                <div className="music-content">
                                    <h2 className="music-name">{platform.name}</h2>
                                    <span className="music-type">{platform.type}</span>
                                    <p className="music-description">{platform.description}</p>
                                    <span className="music-link">Listen Now</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Show Section */}
            <section id="events" className="events-page">
                <div className="events-container">
                    <h1 className="events-title">Upcoming Shows</h1>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className="event-card">
                                <div className="event-content">
                                    <h2 className="event-name">{event.title}</h2>
                                    <span className="event-date">{event.date}</span>
                                    <div className="event-location">📍 {event.location}</div>
                                    <p className="event-description">{event.description}</p>
                                    <Button variant="secondary" onClick={() => console.log('RSVP')}>
                                        Event Details
                                    </Button>
                                </div>
                                <div className="event-poster">
                                    <img src={event.image} alt={event.title} className="event-poster-img" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-events">No upcoming shows at the moment. Stay tuned!</p>
                    )}
                </div>
            </section>

            {/* Where to Purchase Section */}
            <section id="purchase" className="purchase-page">
                <div className="purchase-container">
                    <h1 className="purchase-title">Where to Purchase</h1>
                    <p className="purchase-subtitle">Collect original works and exclusive merchandise</p>
                    <div className="shop-grid">
                        {shops.map((shop) => (
                            <a key={shop.id} href={shop.link} className="shop-card">
                                <img src={shop.image} alt={shop.name} className="shop-image" />
                                <div className="shop-content">
                                    <h2 className="shop-name">{shop.name}</h2>
                                    <span className="shop-type">{shop.type}</span>
                                    <p className="shop-description">{shop.description}</p>
                                    <span className="shop-link">Visit Store</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-page">
                <div className="contact-container">
                    <h1 className="contact-title">Get In Touch</h1>
                    <p className="contact-subtitle">Interested in collaboration or commissioning a piece?</p>

                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" placeholder="Your Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="Your Email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" rows="5" placeholder="Your Message"></textarea>
                        </div>
                        <Button type="submit" variant="primary">Send Message</Button>
                    </form>

                    <div className="contact-info">
                        <p>Email: contact@weiinsight.com</p>
                        <p>Location: Toronto, Canada</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
