-- ============================================================
-- UPSC Prep Tracker — Archive Migration
-- Generates tables to store archived data when a user resets
-- ============================================================

-- 1. Create Archive Tables
-- These tables lack UNIQUE constraints on user_id/day_number so multiple resets can be stored.
-- They do NOT have RLS delete policies, meaning users cannot delete from them.

CREATE TABLE IF NOT EXISTS archive_day_tasks (
  archive_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id   UUID,
  user_id       UUID NOT NULL,
  day_number    INTEGER,
  sort_order    INTEGER,
  subject       TEXT,
  topic         TEXT,
  target_hours  REAL,
  actual_hours  REAL,
  notes         TEXT,
  archived_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS archive_day_wellbeing (
  archive_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id   UUID,
  user_id       UUID NOT NULL,
  day_number    INTEGER,
  sleep_hours   REAL,
  water_litres  REAL,
  exercise      BOOLEAN,
  mood          INTEGER,
  archived_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS archive_daily_summaries (
  archive_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id   UUID,
  user_id       UUID NOT NULL,
  day_number    INTEGER,
  date          TEXT,
  total_hours   REAL,
  subjects      TEXT[],
  streak        INTEGER,
  archived_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS archive_mock_tests (
  archive_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id   UUID,
  user_id       UUID NOT NULL,
  name          TEXT,
  date          TEXT,
  total_score   REAL,
  max_score     REAL,
  archived_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS archive_current_affairs (
  archive_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id   UUID,
  user_id       UUID NOT NULL,
  date          TEXT,
  topic         TEXT,
  category      TEXT,
  source        TEXT,
  notes         TEXT,
  revised       BOOLEAN,
  archived_at   TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes for efficient admin querying
CREATE INDEX IF NOT EXISTS idx_archive_day_tasks_user ON archive_day_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_archive_day_wellbeing_user ON archive_day_wellbeing(user_id);
CREATE INDEX IF NOT EXISTS idx_archive_daily_summaries_user ON archive_daily_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_archive_mock_tests_user ON archive_mock_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_archive_current_affairs_user ON archive_current_affairs(user_id);

-- 3. Archive RPC Function
-- This function runs with SECURITY DEFINER (admin privileges).
-- It copies the user's data to the archive tables and then deletes it from the main tables.
CREATE OR REPLACE FUNCTION archive_user_data(target_user_id UUID)
RETURNS void AS $$
BEGIN
  -- 1. Copy to archive
  INSERT INTO archive_day_tasks (original_id, user_id, day_number, sort_order, subject, topic, target_hours, actual_hours, notes)
  SELECT id, user_id, day_number, sort_order, subject, topic, target_hours, actual_hours, notes 
  FROM day_tasks WHERE user_id = target_user_id;

  INSERT INTO archive_day_wellbeing (original_id, user_id, day_number, sleep_hours, water_litres, exercise, mood)
  SELECT id, user_id, day_number, sleep_hours, water_litres, exercise, mood 
  FROM day_wellbeing WHERE user_id = target_user_id;

  INSERT INTO archive_daily_summaries (original_id, user_id, day_number, date, total_hours, subjects, streak)
  SELECT id, user_id, day_number, date, total_hours, subjects, streak 
  FROM daily_summaries WHERE user_id = target_user_id;

  INSERT INTO archive_mock_tests (original_id, user_id, name, date, total_score, max_score)
  SELECT id, user_id, name, date, total_score, max_score 
  FROM mock_tests WHERE user_id = target_user_id;

  INSERT INTO archive_current_affairs (original_id, user_id, date, topic, category, source, notes, revised)
  SELECT id, user_id, date, topic, category, source, notes, revised 
  FROM current_affairs WHERE user_id = target_user_id;

  -- 2. Delete from main tables
  -- mock_subject_scores cascades from mock_tests automatically, so no need to archive/delete them individually 
  -- (unless we want to preserve scores too, but for simplicity we archive the mock headers)
  
  DELETE FROM day_tasks WHERE user_id = target_user_id;
  DELETE FROM day_wellbeing WHERE user_id = target_user_id;
  DELETE FROM daily_summaries WHERE user_id = target_user_id;
  DELETE FROM mock_tests WHERE user_id = target_user_id;
  DELETE FROM current_affairs WHERE user_id = target_user_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
