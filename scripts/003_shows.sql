CREATE TABLE IF NOT EXISTS shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  description text,
  venue text NOT NULL,
  date timestamptz NOT NULL,
  image_url text NOT NULL,
  ticket_url text NOT NULL,
  price text NOT NULL,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active shows" ON shows;
CREATE POLICY "Anyone can read active shows" ON shows FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can manage shows" ON shows;
CREATE POLICY "Authenticated users can manage shows" ON shows FOR ALL USING (auth.role() = 'authenticated');
