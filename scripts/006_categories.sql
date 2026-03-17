-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access on categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO categories (name, slug, display_order) VALUES
  ('Conductores', 'conductores', 1),
  ('Rock Nacional', 'rock', 2),
  ('Cumbia', 'cumbia', 3),
  ('Humoristas', 'humoristas', 4),
  ('Folklore', 'folklore', 5),
  ('Trap & Latino', 'trap', 6),
  ('Fiestas', 'fiestas', 7),
  ('Egresados', 'egresados', 8)
ON CONFLICT (slug) DO NOTHING;
