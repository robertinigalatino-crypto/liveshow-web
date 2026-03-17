-- Create shows table for upcoming events
CREATE TABLE IF NOT EXISTS public.shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  description TEXT,
  venue TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  image_url TEXT,
  ticket_url TEXT,
  price TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can view active shows)
CREATE POLICY "shows_public_read" ON public.shows 
  FOR SELECT 
  USING (is_active = true);

-- Admin policies (for authenticated users)
CREATE POLICY "shows_admin_insert" ON public.shows 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "shows_admin_update" ON public.shows 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "shows_admin_delete" ON public.shows 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);
