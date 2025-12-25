-- Supabase Database Schema for Wei In Sight CMS
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Site Settings Table (for hero, about, contact sections)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section, key)
);

-- Categories Table (Artwork, Fashion, Product Design, Watchmaking)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Series Table (sub-categories within each category)
CREATE TABLE IF NOT EXISTS series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artworks Table
CREATE TABLE IF NOT EXISTS artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_id UUID REFERENCES series(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    year INTEGER,
    medium TEXT,
    dimensions TEXT,
    description TEXT,
    images JSONB DEFAULT '[]',
    video_url TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT,
    description TEXT,
    image_url TEXT,
    button_text TEXT DEFAULT 'Event Details',
    button_link TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shops Table
CREATE TABLE IF NOT EXISTS shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT,
    description TEXT,
    image_url TEXT,
    link TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exhibitions Table
CREATE TABLE IF NOT EXISTS exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON series FOR SELECT USING (true);
CREATE POLICY "Public read access" ON artworks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON shops FOR SELECT USING (true);
CREATE POLICY "Public read access" ON exhibitions FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Auth insert" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON site_settings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON series FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON series FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON series FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON artworks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON artworks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON artworks FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON events FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON shops FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON shops FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON shops FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON exhibitions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON exhibitions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON exhibitions FOR DELETE USING (auth.role() = 'authenticated');
