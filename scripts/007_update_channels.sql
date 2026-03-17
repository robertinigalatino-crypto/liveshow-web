-- Add missing columns to channels table for full feature support
ALTER TABLE channels ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE channels ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
ALTER TABLE channels ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT false;
