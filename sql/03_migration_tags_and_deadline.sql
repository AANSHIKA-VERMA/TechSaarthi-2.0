-- TechSaarthi — Day 2b migration
-- Run this in Supabase SQL Editor if you already ran 01_schema.sql / 02_seed.sql before today.
-- Safe to run once. It changes two things:
--   1. `tags` goes from a Postgres array to a plain comma-separated text field
--      (much easier to fill in a spreadsheet — no special syntax needed).
--   2. Adds `deadline_text` — a freeform field like "Rolling admissions" or
--      "Closes end of Nov" for opportunities where you don't have (or don't
--      want to track) an exact date.

alter table opportunities
  alter column tags type text using array_to_string(tags, ', ');

alter table opportunities
  alter column tags set default '';

alter table opportunities
  add column if not exists deadline_text text;

-- After this, re-run the updated 02_seed.sql (further down) to refresh the
-- placeholder rows in the new format. Your real data will come in via CSV
-- import from here on, so there's nothing worth preserving in the seed rows.
