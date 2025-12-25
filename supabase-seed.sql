-- Seed Data for Wei In Sight CMS
-- Run this SQL in your Supabase SQL Editor AFTER running supabase-schema.sql

-- ================================
-- CATEGORIES (Gallery Divisions)
-- ================================
INSERT INTO categories (title, description, slug, image_url, "order") VALUES
('Artwork', 'Paintings, Sculpture, Digital Art, and Mixed Media.', 'artwork', 'https://placehold.co/600x400/000000/ffffff?text=Artwork', 0),
('Fashion Design', 'Wearable art and textile engineering.', 'fashion', 'https://placehold.co/600x400/000000/ffffff?text=Fashion', 1),
('Product Design', 'Industrial design and functional art.', 'product-design', 'https://placehold.co/600x400/000000/ffffff?text=Product+Design', 2),
('Watchmaking', 'Precision mechanics and horological art.', 'watchmaking', 'https://placehold.co/600x400/000000/ffffff?text=Watchmaking', 3);

-- ================================
-- SERIES (Sub-categories)
-- ================================
-- Get category IDs dynamically
DO $$
DECLARE
    artwork_id uuid;
    fashion_id uuid;
    product_id uuid;
    watch_id uuid;
BEGIN
    SELECT id INTO artwork_id FROM categories WHERE slug = 'artwork';
    SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';
    SELECT id INTO product_id FROM categories WHERE slug = 'product-design';
    SELECT id INTO watch_id FROM categories WHERE slug = 'watchmaking';

    -- Artwork Series
    INSERT INTO series (category_id, title, slug, "order") VALUES
    (artwork_id, 'Paintings', 'paintings', 0),
    (artwork_id, 'Sculpture', 'sculpture', 1),
    (artwork_id, 'Digital Art', 'digital', 2),
    (artwork_id, 'Mixed Media', 'mixed-media', 3);

    -- Fashion Series
    INSERT INTO series (category_id, title, slug, "order") VALUES
    (fashion_id, 'Runway Collection', 'runway', 0),
    (fashion_id, 'Textile Design', 'textiles', 1),
    (fashion_id, 'Design Sketches', 'sketches', 2);

    -- Product Design Series
    INSERT INTO series (category_id, title, slug, "order") VALUES
    (product_id, 'Industrial Design', 'industrial', 0),
    (product_id, 'Furniture', 'furniture', 1),
    (product_id, 'Prototypes', 'prototypes', 2);

    -- Watchmaking Series
    INSERT INTO series (category_id, title, slug, "order") VALUES
    (watch_id, 'Complications', 'complications', 0),
    (watch_id, 'Restoration', 'restoration', 1),
    (watch_id, 'Movement Studies', 'movements', 2);
END $$;

-- ================================
-- EVENTS (Upcoming Shows)
-- ================================
INSERT INTO events (title, date, location, description, image_url, "order") VALUES
('Neon Dreams Exhibition', 'October 15 - November 30, 2025', 'The Void Gallery, Toronto', 'An immersive experience featuring the latest visual art and sculpture collections.', 'https://placehold.co/400x600/000000/ffffff?text=Neon+Dreams+Poster', 0),
('Sonic Frontiers Live', 'December 12, 2025', 'Cyber Cafe, Toronto', 'Live electronic music performance and visualizer showcase.', 'https://placehold.co/400x600/000000/ffffff?text=Sonic+Frontiers+Poster', 1);

-- ================================
-- SHOPS (Where to Purchase)
-- ================================
INSERT INTO shops (name, type, description, image_url, link, "order") VALUES
('Artsy Store', 'Original Art & Prints', 'Purchase original paintings, limited edition prints, and digital art licenses.', 'https://placehold.co/200x100/000000/ffffff?text=Artsy', '#', 0),
('ArtRewards', 'Online Art Platform', 'Buy original art online. Discover sculptures, paintings, and more from featured artists.', 'https://placehold.co/200x100/000000/ffffff?text=ArtRewards', 'https://www.artrewards.net', 1),
('Right Time Inc', 'Watchmaking & Service', 'Official Service Center for Graham, Edox, BALL, & Rotary. Providing expert watchmaking services in Downtown Toronto since 1999.', 'https://placehold.co/200x100/000000/ffffff?text=RightTime', 'http://www.righttimeinc.com', 2),
('HelloArt', 'Art Platform', 'Discover and collect contemporary art from emerging and established artists.', 'https://placehold.co/200x100/000000/ffffff?text=HelloArt', 'https://helloart.com', 3);

-- ================================
-- EXHIBITIONS (Past Shows & Projects)
-- ================================
INSERT INTO exhibitions (date, title, "order") VALUES
('2025.Aug', 'TRACE Toronto by Public Display Agency', 0),
('2024.Oct', 'Union Art Crawl (Nuit blanche Toronto)​ - Panel Artist', 1),
('2023.Nov', 'RAW Artist Toronto', 2),
('2023.Sep', 'Union Art Crawl (Nuit blanche Toronto)​ - Panel Artist', 3),
('2021.July', 'BAA Gallery Berlin', 4),
('2020.Mar', 'CFDA Design Scholar Award 2020 (Representative of AAU)', 5),
('2016.Oct', 'Shanghai Fashion Week 2017 S/S', 6),
('2016.Feb', 'Art Hearts New York Fashion Week 2017 S/S', 7),
('2015.Oct', 'Vancouver Fashion Week 2016 S/S', 8),
('2012.Mar', 'Sony ACID Pro EDM Music Contest - World Top 20', 9);

-- ================================
-- SITE SETTINGS (Hero & About)
-- ================================
INSERT INTO site_settings (section, key, value) VALUES
-- Hero Section
('hero', 'subtitle', '🇨🇦 Toronto-based multi-field artist'),
('hero', 'cta_primary_text', 'Explore Gallery'),
('hero', 'cta_primary_link', '#gallery'),
('hero', 'cta_secondary_text', 'Contact Me'),
('hero', 'cta_secondary_link', '#contact'),
-- About Section
('about', 'title', 'Jacky (Wei) Ho'),
('about', 'subtitle', 'The Artist Behind "Wei In Sight"'),
('about', 'bio_paragraph_1', '"Wei Ho" is the name my grandpa gave me; it means "Afraid of nothing." He used to be a Fine Art Teacher in school, so I keep using this name for my art to pay tribute to him. My full name is Jacky (Wei) Ho.'),
('about', 'bio_paragraph_2', '"Wei In Sight" means "All my artworks will stay in everyone''s sight."'),
('about', 'bio_paragraph_3', 'I am a Toronto-based multi-field artist with a passion for exploring the intersection of technology, tradition, and expression. My work spans across watchmaking, fashion design, visual arts, and music, each discipline informing the others in a continuous cycle of creativity.');

-- ================================
-- SAMPLE ARTWORKS (For testing)
-- ================================
DO $$
DECLARE
    paintings_id uuid;
BEGIN
    SELECT id INTO paintings_id FROM series WHERE slug = 'paintings';

    INSERT INTO artworks (series_id, title, year, medium, dimensions, description, images, "order") VALUES
    (paintings_id, 'Special Force', 2023, 'Screen print and acrylic', '30 x 20 x 2 in | 76.2 x 50.8 x 5.08 cm', 'An exploration of chaotic urban energy through mixed media.', '["https://placehold.co/800x1000/000000/ffffff?text=Special+Force+1", "https://placehold.co/800x1000/111111/ffffff?text=Special+Force+2"]', 0),
    (paintings_id, 'Neon Horizon', 2024, 'Acrylic on canvas', '24 x 36 in', 'A vivid depiction of a futuristic cityscape at dusk.', '["https://placehold.co/800x1000/000000/ffffff?text=Neon+Horizon"]', 1),
    (paintings_id, 'Digital Dreams', 2024, 'Digital Print', '20 x 30 in', 'Abstract digital composition exploring themes of consciousness.', '["https://placehold.co/800x1000/222222/ffffff?text=Digital+Dreams"]', 2);
END $$;
