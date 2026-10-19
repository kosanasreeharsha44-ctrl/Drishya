-- =========================================================================
-- DRISHYA CREATIVE STUDIO DATABASE SCHEMA & MIGRATION SCRIPT
-- Compatible with PostgreSQL (Supabase / Cloud SQL / Neon)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ADMIN ACCOUNTS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'client', 'creator'
    two_factor_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_contact TEXT NOT NULL,
    service TEXT NOT NULL, -- 'video_editing', 'poster_photo_editing', 'idea_submission'
    title TEXT NOT NULL,
    description TEXT,
    deadline DATE,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_status TEXT NOT NULL DEFAULT 'Unpaid', -- 'Unpaid', 'Partial', 'Paid'
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Review', 'Completed'
    progress_percent INT NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROJECT TASKS (Checklist items that auto-calculate project progress)
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    is_done BOOLEAN DEFAULT FALSE NOT NULL,
    "order" INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROJECT ATTACHMENTS & FOOTAGE LINKS
CREATE TABLE IF NOT EXISTS project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT DEFAULT 'drive_folder',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CLIENT INQUIRIES & QUOTE REQUESTS
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT NOT NULL,
    budget TEXT,
    deadline DATE,
    details TEXT NOT NULL,
    reference_link TEXT,
    status TEXT DEFAULT 'New' NOT NULL, -- 'New', 'Contacted', 'Converted', 'Closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CREATIVE IDEAS & REVENUE-SHARE PROGRAM
CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'Cinematic Reel / Docu',
    file_url TEXT,
    consent BOOLEAN DEFAULT TRUE NOT NULL,
    status TEXT DEFAULT 'New' NOT NULL, -- 'New', 'Reviewing', 'Accepted', 'Earning', 'Paid', 'Rejected'
    share_percent NUMERIC(5, 2) DEFAULT 20.00 NOT NULL,
    amount_earned NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    amount_owed NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    amount_paid NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    payout_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PORTFOLIO SHOWCASE
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'video', 'poster', 'before_after'
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'videos', 'posters', 'photo_edits'
    tagline TEXT,
    media_url TEXT,
    thumbnail_url TEXT NOT NULL,
    before_url TEXT,
    after_url TEXT,
    "order" INT DEFAULT 1 NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT,
    text TEXT NOT NULL,
    rating INT DEFAULT 5 NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. FAQS
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'Workflow',
    "order" INT DEFAULT 1 NOT NULL
);

-- 10. STUDIO SETTINGS
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- =========================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Public can read visible portfolio, testimonials, and faqs
CREATE POLICY "Public can read visible portfolio" ON portfolio_items FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read visible testimonials" ON testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read faqs" ON faqs FOR SELECT USING (true);

-- Public can submit inquiries and ideas (INSERT only)
CREATE POLICY "Public can submit inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit ideas" ON ideas FOR INSERT WITH CHECK (true);

-- Admin has full read/write access (requires authenticated role = 'admin')
CREATE POLICY "Admins full access to projects" ON projects FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins full access to inquiries" ON inquiries FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins full access to ideas" ON ideas FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins full access to portfolio" ON portfolio_items FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');
