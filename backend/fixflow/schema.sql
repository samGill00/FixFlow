-- scheaam for the dabase

-- Crete User Table
CREATE TABLE user (
  userId TEXT PRIMARY KEY,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password VARCHAR NOT NULL
);


CREATE TABLE project (
  projectId TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  team TEXT,
  tags TEXT,         -- Store as comma-separated string or JSON
  bugDate TEXT,
  userId TEXT,
  FOREIGN KEY (userId) REFERENCES user(userId)
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
-- Insert Data into user table
INSERT INTO user (userId, firstname, lastname, username, password) VALUES
('US1234', 'James','Smith', 'james112', "$2b$12$YY1mEtRRW/CR7C3ugSmURuEoLCj2LQkq6USvDsB7JVW16e5avm9hS"),
('US1111', 'Laura','Jones', 'laura121', "$2b$12$Z8H3T1b/T8G6gybdJFNFlOKXOByNSOyTLCe3O1M5HCiTNg3Li6oUy");

-- Insert data into project table
INSERT INTO project (projectId, title, team, tags, bugDate, userId) VALUES
('PJ123', 'Bug tracker', 'Alpha', 'UI, React', '2025-10-20', 'US1234'),
('PN121', 'Mine sweeper', 'Jenna', 'Game, React', '2025-10-19', 'US1111');

-- Insert data into bug table
INSERT INTO bug (title, status, priority, assigned, date, projectId) VALUES
('Login button not responding', 'Open', 'High', 'Frontend Team', '2025-10-20', 'PJ123'),
('API timeout on dashboard load', 'In Progress', 'Critical', 'Backend Team', '2025-10-19', 'PJ123'),
('Backend cracked', 'Open', 'High', 'Frontend Team', '2025-10-20', 'PN121'),
('Flask is empty nothing there', 'In Progress', 'Critical', 'Backend Team', '2025-10-19', 'PN121');




-- example pass: mypass123 (james), yourcity111 (laura) 