-- Add departments
INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Finance');
-- Add roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 60000, 1),
  ('Software Engineer', 80000, 2),
  ('Accountant', 55000, 3);
-- Add employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Michael', 'Brown', 3, NULL);