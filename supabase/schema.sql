-- Workout Tracker Schema
-- Run this in the Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

create table exercises (
  id bigint primary key generated always as identity,
  name text not null unique,
  category text not null,  -- 'lower', 'upper_pull', 'upper_push', 'warmup', 'accessory'
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
  ('Barbell Back Squat', 'lower', 'Brace core, break at hips and knees simultaneously. Aim for parallel depth.', false, null),
  ('Romanian Deadlift', 'lower', 'Hinge at hips, slight knee bend. Feel stretch in hamstrings. Keep bar close to legs.', false, null),
  ('Leg Press', 'lower', 'Feet shoulder-width on platform. Don''t lock out knees at top.', false, null),
  ('Bulgarian Split Squat', 'lower', 'Rear foot on bench. Keep torso upright. Control the descent.', true, 'Watch knee tracking over toes. Stop if sharp knee pain.'),
  ('Walking Lunges', 'lower', 'Long stride, upright torso. Drive through front heel.', false, null),
  ('Leg Curl', 'lower', 'Control the eccentric. Full range of motion.', false, null),
  ('Leg Extension', 'lower', 'Pause at top. Don''t use momentum.', true, 'Light weight, high reps only. Stop if knee pain.'),
  ('Calf Raise', 'lower', 'Full stretch at bottom, pause at top. Slow eccentric.', false, null),
  ('Hip Thrust', 'lower', 'Drive through heels. Squeeze glutes at top. Don''t hyperextend lower back.', false, null),
  ('Goblet Squat', 'lower', 'Hold dumbbell at chest. Sit between legs. Great for warming up squat pattern.', false, null),
  ('Sumo Deadlift', 'lower', 'Wide stance, toes out. Drive through heels. Keep chest up.', false, null),
  ('Front Squat', 'lower', 'Elbows high, bar in front rack. More quad-dominant than back squat.', true, 'Requires good wrist/shoulder mobility. Use cross-arm grip if needed.'),
  ('Step Ups', 'lower', 'Drive through top foot. Don''t push off bottom foot. Control descent.', false, null),
  ('Glute Bridge', 'lower', 'Shoulders on ground. Squeeze glutes at top. Good activation exercise.', false, null),

  -- Upper Pull Exercises
  ('Barbell Row', 'upper_pull', 'Hinge forward ~45 degrees. Pull to lower chest. Squeeze shoulder blades.', false, null),
  ('Pull Up', 'upper_pull', 'Full hang at bottom. Pull until chin over bar. Control the descent.', false, null),
  ('Lat Pulldown', 'upper_pull', 'Slight lean back. Pull to upper chest. Squeeze lats at bottom.', false, null),
  ('Cable Row', 'upper_pull', 'Sit upright. Pull to belly button. Squeeze shoulder blades together.', false, null),
  ('Face Pull', 'upper_pull', 'Pull rope to face level. Externally rotate at top. Great for rear delts and shoulder health.', false, null),
  ('Dumbbell Row', 'upper_pull', 'One arm at a time. Pull to hip. Keep elbow close to body.', false, null),
  ('Hammer Curl', 'upper_pull', 'Neutral grip. No swinging. Squeeze at top.', false, null),
  ('Barbell Curl', 'upper_pull', 'Elbows pinned to sides. Full range of motion. Control the negative.', false, null),
  ('Rear Delt Fly', 'upper_pull', 'Slight bend in elbows. Squeeze shoulder blades. Light weight, high reps.', false, null),
  ('Shrugs', 'upper_pull', 'Straight up, not rolling. Hold at top for 1 second.', false, null),

  -- Upper Push Exercises
  ('Barbell Bench Press', 'upper_push', 'Arch back slightly, feet flat. Touch chest, drive up. Keep wrists straight.', false, null),
  ('Overhead Press', 'upper_push', 'Brace core. Press straight up, move head through at top. Don''t lean back excessively.', true, 'Stop if shoulder pain. Use dumbbells as alternative if needed.'),
  ('Incline Dumbbell Press', 'upper_push', '30-45 degree incline. Press up and slightly in. Good upper chest builder.', false, null),
  ('Dumbbell Lateral Raise', 'upper_push', 'Slight bend in elbows. Raise to shoulder height. Control the descent.', false, null),
  ('Tricep Pushdown', 'upper_push', 'Elbows pinned to sides. Full extension. Squeeze at bottom.', false, null),
  ('Cable Fly', 'upper_push', 'Slight forward lean. Bring hands together with slight bend in elbows.', false, null),
  ('Dips', 'upper_push', 'Lean slightly forward for chest emphasis. Control descent. Don''t go too deep initially.', true, 'Stop if shoulder pain. Can substitute with close-grip bench.'),
  ('Skull Crushers', 'upper_push', 'Lower to forehead area. Keep elbows pointed up. Use EZ bar for wrist comfort.', false, null),
  ('Arnold Press', 'upper_push', 'Start palms facing you, rotate as you press. Good shoulder builder.', false, null),
  ('Close Grip Bench', 'upper_push', 'Hands shoulder-width. Elbows close to body. Great tricep builder.', false, null);
