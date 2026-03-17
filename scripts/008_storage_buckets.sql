-- ============================================
-- Create Storage Buckets for image uploads
-- ============================================

-- Bucket: artists (profile images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('artists', 'artists', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Bucket: artists-gallery (artist gallery images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('artists-gallery', 'artists-gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Bucket: shows (show poster/cover images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('shows', 'shows', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Bucket: channels (channel logos/images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('channels', 'channels', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Bucket: settings (site logo, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('settings', 'settings', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS Policies: Public read, authenticated write
-- ============================================

-- ARTISTS bucket
CREATE POLICY "Public read artists" ON storage.objects
  FOR SELECT USING (bucket_id = 'artists');

CREATE POLICY "Authenticated upload artists" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artists' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete artists" ON storage.objects
  FOR DELETE USING (bucket_id = 'artists' AND auth.role() = 'authenticated');

-- ARTISTS-GALLERY bucket
CREATE POLICY "Public read artists-gallery" ON storage.objects
  FOR SELECT USING (bucket_id = 'artists-gallery');

CREATE POLICY "Authenticated upload artists-gallery" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artists-gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete artists-gallery" ON storage.objects
  FOR DELETE USING (bucket_id = 'artists-gallery' AND auth.role() = 'authenticated');

-- SHOWS bucket
CREATE POLICY "Public read shows" ON storage.objects
  FOR SELECT USING (bucket_id = 'shows');

CREATE POLICY "Authenticated upload shows" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'shows' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete shows" ON storage.objects
  FOR DELETE USING (bucket_id = 'shows' AND auth.role() = 'authenticated');

-- CHANNELS bucket
CREATE POLICY "Public read channels" ON storage.objects
  FOR SELECT USING (bucket_id = 'channels');

CREATE POLICY "Authenticated upload channels" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'channels' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete channels" ON storage.objects
  FOR DELETE USING (bucket_id = 'channels' AND auth.role() = 'authenticated');

-- SETTINGS bucket
CREATE POLICY "Public read settings" ON storage.objects
  FOR SELECT USING (bucket_id = 'settings');

CREATE POLICY "Authenticated upload settings" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'settings' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete settings" ON storage.objects
  FOR DELETE USING (bucket_id = 'settings' AND auth.role() = 'authenticated');
