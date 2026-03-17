-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  bio TEXT,
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  links JSONB DEFAULT '[]',
  gallery TEXT[] DEFAULT '{}',
  whatsapp_number TEXT DEFAULT '5491131432020',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create channels table for live TV channels
CREATE TABLE IF NOT EXISTS channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  stream_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_artists_category ON artists(category);
CREATE INDEX IF NOT EXISTS idx_artists_active ON artists(is_active);
CREATE INDEX IF NOT EXISTS idx_artists_order ON artists(display_order);
CREATE INDEX IF NOT EXISTS idx_channels_active ON channels(is_active);
CREATE INDEX IF NOT EXISTS idx_channels_order ON channels(display_order);

-- Enable RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Allow public read access on artists" ON artists
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access on channels" ON channels
  FOR SELECT USING (is_active = true);

-- Policies for authenticated users (admin)
CREATE POLICY "Allow authenticated users full access on artists" ON artists
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access on channels" ON channels
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert some sample channels
INSERT INTO channels (name, logo_url, stream_url, display_order) VALUES
  ('Live Show TV', '/channels/liveshow-tv.png', 'https://youtube.com/liveshow', 1),
  ('El Club de la Buena Gente', '/channels/club-buena-gente.png', 'https://youtube.com/clubbuenagente', 2),
  ('Big Latino', '/channels/big-latino.png', 'https://youtube.com/biglatino', 3),
  ('Rock Argento', '/channels/rock-argento.png', 'https://youtube.com/rockargento', 4),
  ('La Gran Dulce TV', '/channels/gran-dulce.png', 'https://youtube.com/grandulce', 5),
  ('Vivi El Campo', '/channels/vivi-campo.png', 'https://youtube.com/vivielcampo', 6);
