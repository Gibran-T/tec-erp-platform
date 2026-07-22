-- Additive: typed run configuration for optional student reflections.
ALTER TABLE "pedagogical_course_run"
  ADD COLUMN IF NOT EXISTS "reflectionsEnabled" BOOLEAN NOT NULL DEFAULT false;

-- Historical / legacy Run 1 stays disabled unless explicitly enabled later.
UPDATE "pedagogical_course_run"
SET "reflectionsEnabled" = false
WHERE "runSequence" = 1
  AND COALESCE(("metadataJson"->>'legacyBackfill')::boolean, false) = true;
