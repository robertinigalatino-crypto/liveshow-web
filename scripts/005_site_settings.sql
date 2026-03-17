-- Create site_settings table (key-value store for site configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access on site_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users full access on site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', '5491131432020'),
  ('whatsapp_display', '+54 9 11 3143-2020'),
  ('instagram_handle', 'liveshowproducciones'),
  ('location', 'Buenos Aires, Argentina'),
  ('hero_title', 'Contrata los Mejores Shows para tu Evento'),
  ('hero_subtitle', 'Produccion integral de eventos con tecnica propia: sonido profesional, luces, pantallas LED, escenario fijo y movil.'),
  ('company_name', 'Live Show Producciones'),
  ('logo_url', '/logo.png'),
  ('footer_description', 'Produccion integral de eventos con los mejores artistas de Argentina. Tecnica propia y servicio premium.'),
  ('footer_event_types', 'Eventos corporativos • Fiestas privadas • Shows publicos • Casamientos • Egresados')
ON CONFLICT (key) DO NOTHING;
