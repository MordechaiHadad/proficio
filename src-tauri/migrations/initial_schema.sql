CREATE TABLE habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'smoking',
  description TEXT,
  created_at TEXT,
  is_active BOOLEAN DEFAULT 1
);

CREATE TABLE habit_tracking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  failure_date TEXT,
  failed BOOLEAN DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
  UNIQUE(habit_id, failure_date)
);


CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  is_dark_mode BOOLEAN DEFAULT 0
);

CREATE INDEX idx_habit_tracking_habit_id ON habit_tracking(habit_id);
CREATE INDEX idx_habit_tracking_date ON habit_tracking(failure_date);
