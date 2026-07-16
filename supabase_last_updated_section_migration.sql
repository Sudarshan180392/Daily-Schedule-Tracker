-- ============================================================
-- UPSC Prep Tracker — Last Updated Section Migration
-- Generated: 2026-07-16
-- Paste this entire script into the Supabase SQL Editor and run.
-- ============================================================

-- Add two new columns to user_settings to track which section
-- the user last updated and when they did it.

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS last_updated_section TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS last_section_updated_at TIMESTAMPTZ DEFAULT NULL;

-- Done! The columns are nullable so existing rows remain unaffected.
-- The app will populate these automatically on every save.
