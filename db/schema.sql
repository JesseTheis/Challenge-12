
--Describe the schema of the database
--Create the tables department, role, and employee
--Add the following columns to the department table: id, name
CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);
--Add the following columns to the role table: id, title, salary, department_id
--Add foreign key reference to the department table
CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
--Add the following columns to the employee table: id, first_name, last_name, role_id, manager_id
--Add foreign key references to the role and employee tables
--The manager_id column should reference the employee id column
CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);