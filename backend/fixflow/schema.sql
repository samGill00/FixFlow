-- scheaam for the dabase

CREATE TABLE project (
  projectId TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  team TEXT,
  tags TEXT,         -- Store as comma-separated string or JSON
  bugDate TEXT
);



-- Create the bug table
CREATE TABLE bug (
  bugId INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT,
  priority TEXT,
  assigned TEXT,
  date TEXT,
  projectId TEXT,
  FOREIGN KEY (projectId) REFERENCES project(projectId)
);


--adding some old data 
-- Insert data into project table
INSERT INTO project (projectId, title, team, tags, bugDate) VALUES
('PJ123', 'Bug tracker', 'Alpha', 'UI, React', '2025-10-20'),
('PN121', 'Mine sweeper', 'Jenna', 'Game, React', '2025-10-19');

-- Insert data into bug table
INSERT INTO bug (title, status, priority, assigned, date, projectId) VALUES
('Login button not responding', 'Open', 'High', 'Frontend Team', '2025-10-20', 'PJ123'),
('API timeout on dashboard load', 'In Progress', 'Critical', 'Backend Team', '2025-10-19', 'PJ123'),
('Backend cracked', 'Open', 'High', 'Frontend Team', '2025-10-20', 'PN121'),
('Flask is empty nothing there', 'In Progress', 'Critical', 'Backend Team', '2025-10-19', 'PN121');
