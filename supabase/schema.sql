-- Workout Tracker Schema
-- Run this in the Supabase SQL Editor

-- ============================================
-- WARNING: DESTROYS ALL DATA. Only run on fresh/dev databases.
-- ============================================
drop table if exists sets cascade;
drop table if exists sessions cascade;
drop table if exists exercises cascade;

-- ============================================
-- TABLES
-- ============================================

create table exercises (
  id bigint primary key generated always as identity,
  name text not null unique,
  category text not null,  -- 'lower', 'upper_pull', 'upper_push'
  coaching_note text,
  is_caution boolean default false,
  caution_note text
);

create table sessions (
  id bigint primary key generated always as identity,
  date date not null,
  session_type text not null,  -- 'lower_a', 'lower_b', 'pull', 'push', 'yoga', 'rest'
  phase integer not null default 1,
  week_number integer not null default 1,
  pain_level integer,  -- 0-10
  notes text,
  completed_at timestamptz
);

create table sets (
  id bigint primary key generated always as identity,
  session_id bigint references sessions(id) on delete cascade,
  exercise_id bigint references exercises(id),
  set_number integer not null,
  weight_lbs numeric,
  reps_completed integer,
  rpe integer  -- optional, 1-10
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table exercises enable row level security;
alter table sessions enable row level security;
alter table sets enable row level security;

create policy "Allow all for anon" on exercises for all to anon using (true) with check (true);
create policy "Allow all for anon" on sessions for all to anon using (true) with check (true);
create policy "Allow all for anon" on sets for all to anon using (true) with check (true);

-- ============================================
-- INDEXES
-- ============================================

create index idx_sessions_date on sessions(date);
create index idx_sets_session on sets(session_id);
create index idx_sets_exercise on sets(exercise_id);

-- ============================================
-- SEED DATA: EXERCISES
-- ============================================

-- Lower Body Exercises
insert into exercises (name, category, coaching_note, is_caution, caution_note) values
  ('Leg Press', 'lower', 'Feet mid-high on plate. Controlled descent. Don''t aggressively lock out at top.', false, null),
  ('Terminal Knee Extension with Band (TKE)', 'lower', 'Anchor band behind knee. Stand on slight heel raise. Drive knee to full extension. VMO priority exercise.', false, null),
  ('Isometric Wall Sit', 'lower', 'Knees at 60 degrees, not 90. Pain-free range only.', false, null),
  ('Glute Bridge', 'lower', 'Drive through heels. Full hip extension at top.', false, null),
  ('Standing Calf Raises', 'lower', 'Slow and controlled. Both soleus and gastroc support knee mechanics.', false, null),
  ('Step-Ups', 'lower', 'Lead with working leg. Don''t push off trailing foot. Control the descent.', false, null),
  ('Romanian Deadlift (RDL)', 'lower', 'Soft knee, hinge from hip. Start with dumbbells. Hamstring lengthening under load.', false, null),
  ('Side-Lying Hip Abduction with Band', 'lower', 'Glute med activation. Critical for IT band tension and lateral knee stability.', false, null),
  ('Reverse Lunge', 'lower', 'Rear foot drops straight down. Front knee stacked over ankle. Less patellar load than forward lunge.', false, null),
  ('Leg Press (with pause)', 'lower', 'Increase weight 5-10% from Phase 1. Add a 2-second pause at bottom.', false, null),
  ('Single-Leg Wall Sit', 'lower', 'Assisted if needed. Progress from double leg Phase 1.', false, null),
  ('Single-Leg Glute Bridge', 'lower', 'Drive through heel, full hip extension.', false, null),
  ('Standing Calf Raises (weighted)', 'lower', 'Add dumbbell or use calf raise machine. Increase load from Phase 1.', false, null),
  ('Step-Ups (tall box, with dumbbells)', 'lower', 'Increase box height from Phase 1. Add light dumbbells. Same form cues apply.', false, null),
  ('Single-Leg RDL', 'lower', 'Progress from bilateral RDL. Use dumbbells. Control balance.', false, null),
  ('Bulgarian Split Squat', 'lower', 'Back foot elevated. Front shin vertical. Only deepen as comfort allows.', true, 'High patellar load movement — earn the depth. Stop well above 90 degrees initially.'),
  ('Nordic Curl Negatives', 'lower', '4-5 second eccentric lowering only. Anchor feet under bench or have partner hold. Clinical gold standard for hamstring injury prevention.', false, null),
  ('Leg Press (heavy)', 'lower', 'Working at higher intensity now. Full range, controlled eccentric.', false, null),
  ('Step-Down Exercise', 'lower', 'Stand on step, slowly lower opposite heel toward floor without touching, return. Clinical VMO and patellar tracking exercise.', false, null),
  ('Sled Push', 'lower', 'Zero patellar compression, high quad and glute demand. Directly mimics running mechanics. Load moderately.', false, null),
  ('Single-Leg Glute Bridge (elevated)', 'lower', 'Foot on bench. Full hip extension. Increased hamstring demand.', false, null),
  ('Standing Calf Raises (heavy)', 'lower', 'Heavy load, slow tempo. 2 sec up, 2 sec hold, 3 sec down.', false, null),
  ('Bulgarian Split Squat (full depth)', 'lower', 'Earned depth from Phase 2. Add dumbbells or barbell. Front shin vertical.', true, 'High patellar load — only progress to full depth if pain-free.'),
  ('Single-Leg RDL (heavier)', 'lower', 'Increase load from Phase 2. Full hamstring stretch.', false, null),
  ('TKE with Band + Hip Abduction', 'lower', 'Maintained as warm-up staple and session finisher in Phase 3.', false, null),

  -- Upper Pull Exercises
  ('Barbell or Dumbbell Row', 'upper_pull', 'Primary back mass builder. Control the eccentric.', false, null),
  ('Lat Pulldown or Weighted Pull-Up', 'upper_pull', 'Full stretch at top. Drive elbows down not hands.', false, null),
  ('Seated Cable Row (narrow grip)', 'upper_pull', 'Mid-back thickness. Keep chest tall throughout.', false, null),
  ('Face Pulls (cable)', 'upper_pull', 'Rear delt and external rotator health. Non-negotiable for shoulder longevity.', false, null),
  ('Incline Dumbbell Curl', 'upper_pull', 'Full bicep stretch at bottom. Don''t rush the eccentric.', false, null),
  ('Hammer Curl', 'upper_pull', 'Brachialis and forearm development.', false, null),

  -- Upper Push Exercises
  ('Barbell or Dumbbell Bench Press', 'upper_push', 'Keep it heavy relative to capacity. Primary chest strength movement.', false, null),
  ('Incline Dumbbell Press', 'upper_push', 'Upper chest emphasis. Full stretch at bottom.', false, null),
  ('Overhead Press', 'upper_push', 'Primary shoulder mass builder. Seated or standing both fine.', false, null),
  ('Lateral Raises', 'upper_push', 'Strict form, no momentum. Control the eccentric. Most people cheat these and undertrain the medial delt.', false, null),
  ('Cable Chest Fly or Pec Deck', 'upper_push', 'Full stretch at extension. Isolation finisher.', false, null),
  ('Tricep Pushdown (rope)', 'upper_push', 'Superset with overhead extension if time is short.', false, null),
  ('Overhead Tricep Extension', 'upper_push', 'Long head emphasis — most undertrained part of the tricep.', false, null);
