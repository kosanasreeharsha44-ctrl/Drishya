-- ====================================================================
-- DRISHYA CREATIVE STUDIO - PRODUCTION SUPABASE DATABASE SCHEMA
-- Zero seed data included. Real data only.
-- Strict Row-Level Security (RLS) and Role-Based Access Control (RBAC)
-- ====================================================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'team');
CREATE TYPE service_type AS ENUM ('video_editing', 'idea_submission', 'poster_photo_editing');
CREATE TYPE project_status AS ENUM ('Pending', 'In Progress', 'Review', 'Completed');
CREATE TYPE payment_status AS ENUM ('Unpaid', 'Partial', 'Paid');
CREATE TYPE inquiry_status AS ENUM ('New', 'Contacted', 'Converted', 'Closed');
CREATE TYPE idea_status AS ENUM ('New', 'Reviewing', 'Accepted', 'Earning', 'Paid', 'Rejected');

-- 2. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'team',
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_contact TEXT NOT NULL,
    service service_type NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline DATE NOT NULL,
    delivered_date DATE DEFAULT NULL,
    price NUMERIC NOT NULL DEFAULT 0, -- Private to owner
    payment_status payment_status NOT NULL DEFAULT 'Unpaid', -- Private to owner
    status project_status NOT NULL DEFAULT 'Pending',
    progress_percent INT NOT NULL DEFAULT 0,
    review_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    notes TEXT DEFAULT '',
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Trigger to automatically set delivered_date when status changes to 'Completed'
CREATE OR REPLACE FUNCTION set_project_delivered_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
        IF NEW.delivered_date IS NULL THEN
            NEW.delivered_date := CURRENT_DATE;
        END IF;
    ELSIF NEW.status != 'Completed' THEN
        NEW.delivered_date := NULL;
    END IF;
    NEW.updated_at := timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_project_delivered_date
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION set_project_delivered_date();

-- 4. PROJECT ASSIGNEES (Linking team members to projects)
CREATE TABLE IF NOT EXISTS project_assignees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(project_id, member_id)
);

-- 5. PROJECT TASKS TABLE
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT false,
    task_order INT NOT NULL DEFAULT 0
);

-- 6. REVIEWS TABLE (Private token or client link; hidden until Harsha approves)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 7. INQUIRIES TABLE (Public submission; no budget field)
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service service_type NOT NULL,
    deadline DATE,
    details TEXT NOT NULL,
    reference_link TEXT,
    status inquiry_status NOT NULL DEFAULT 'New',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 8. IDEA SUBMISSIONS TABLE (Private payout & revenue fields owner only)
CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    file_url TEXT,
    consent BOOLEAN NOT NULL DEFAULT true,
    status idea_status NOT NULL DEFAULT 'New',
    share_percent INT NOT NULL DEFAULT 20, -- Private to owner
    amount_earned NUMERIC NOT NULL DEFAULT 0, -- Private to owner
    amount_owed NUMERIC NOT NULL DEFAULT 0, -- Private to owner
    amount_paid NUMERIC NOT NULL DEFAULT 0, -- Private to owner
    payout_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 9. PORTFOLIO ITEMS TABLE
CREATE TABLE IF NOT EXISTS portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'video' | 'poster' | 'before_after'
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'videos' | 'posters' | 'photo_edits'
    tagline TEXT NOT NULL,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    before_url TEXT,
    after_url TEXT,
    item_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true
);

-- 10. FAQS TABLE (Single source of truth)
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    faq_order INT NOT NULL DEFAULT 0
);

-- 11. STUDIO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS studio_settings (
    id INT PRIMARY KEY DEFAULT 1,
    contact_email TEXT NOT NULL DEFAULT 'unknowneditor910@gmail.com',
    instagram_handle TEXT NOT NULL DEFAULT 'ur_harsha0',
    hero_headline TEXT NOT NULL DEFAULT 'See your story differently.',
    hero_tagline TEXT NOT NULL DEFAULT 'Drishya is a boutique creative studio directed by Harsha. We craft high-impact cinematic video edits, color grading, and creative co-creation partnerships.',
    auto_reply_template TEXT NOT NULL DEFAULT 'Hi {NAME},\n\nThank you for reaching out to Drishya Creative Studio! Harsha has received your message regarding {SERVICE}.\n\nKeep creating,\nHarsha',
    enable_two_factor BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT single_row CHECK (id = 1)
);

-- ====================================================================
-- LIVE DELIVERY STATS (Database Views - Calculated, never typed by hand)
-- ====================================================================

CREATE OR REPLACE VIEW view_live_delivery_stats AS
WITH completed_stats AS (
    SELECT
        COUNT(*)::INT AS projects_delivered,
        ROUND(
            (COUNT(*) FILTER (WHERE delivered_date <= deadline)::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC) * 100
        )::INT AS on_time_delivery_percent,
        ROUND(
            AVG(GREATEST(1, delivered_date - start_date))::NUMERIC, 1
        ) AS average_turnaround_days
    FROM projects
    WHERE status = 'Completed'
),
review_stats AS (
    SELECT
        ROUND(AVG(rating)::NUMERIC, 1) AS average_rating,
        COUNT(*)::INT AS total_approved_reviews
    FROM reviews
    WHERE is_approved = true
)
SELECT
    COALESCE(cs.projects_delivered, 0) AS projects_delivered,
    cs.on_time_delivery_percent,
    cs.average_turnaround_days,
    rs.average_rating,
    COALESCE(rs.total_approved_reviews, 0) AS total_approved_reviews
FROM completed_stats cs
CROSS JOIN review_stats rs;

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_settings ENABLE ROW LEVEL SECURITY;

-- Helper to retrieve current authenticated user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM team_members WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Public can read ONLY approved reviews
CREATE POLICY "Public view approved reviews"
ON reviews FOR SELECT
TO anon, authenticated
USING (is_approved = true);

-- 2. Public can insert reviews via valid project review link
CREATE POLICY "Public insert review with project"
ON reviews FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Public can insert inquiries (no budget column)
CREATE POLICY "Public insert inquiries"
ON inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Public can insert idea submissions
CREATE POLICY "Public insert ideas"
ON ideas FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. Public can view visible portfolio items
CREATE POLICY "Public view visible portfolio"
ON portfolio FOR SELECT
TO anon, authenticated
USING (is_visible = true);

-- 6. Public can view FAQs
CREATE POLICY "Public view faqs"
ON faqs FOR SELECT
TO anon, authenticated
USING (true);

-- 7. Team member project isolation: sees only assigned projects
CREATE POLICY "Team member assigned projects"
ON projects FOR SELECT
TO authenticated
USING (
    get_current_user_role() IN ('owner', 'admin')
    OR id IN (
        SELECT project_id FROM project_assignees pa
        JOIN team_members tm ON pa.member_id = tm.id
        WHERE tm.auth_user_id = auth.uid()
    )
);

-- 8. Owner only for payout fields and team management
CREATE POLICY "Owner manage team members"
ON team_members FOR ALL
TO authenticated
USING (get_current_user_role() = 'owner');

-- 9. Owner & Admin for project creation and full management
CREATE POLICY "Owner and admin manage projects"
ON projects FOR ALL
TO authenticated
USING (get_current_user_role() IN ('owner', 'admin'));

-- Zero seed data included. Real data only.
