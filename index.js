//const inquirer = require(‘inquirer’) is used to prompt the user with a list of options to choose from
//const pool = require(‘./db’) is used to import the pool object from the db.js file
const inquirer = require('./node_modules/inquirer');
const pool = require('./db');
//the purpose of main menu is to prompt the user with a list of options to choose from
const mainMenu = async () => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit'
      ],
    },
  ]);
//switch statement is used to perform different actions based on different conditions
  switch (choice) {
    case 'View All Departments':
      return viewAllDepartments();
    case 'View All Roles':
      return viewAllRoles();
    case 'View All Employee':
      return viewAllEmployees();
    case 'Add a Department':
      return addDepartment();
    case 'Add a Role':
      return addRole();
    case 'Add an Employee':
      return addEmployee();
    case 'Update an Employee Role':
      return updateEmployeeRole();
    default:
      return process.exit();
  }
};
//viewAllDepartments function is used to display all the departments in the database from the department table
const viewAllDepartments = async () => {
  const res = await pool.query('SELECT * FROM department');
  console.table(res.rows);
  mainMenu();
};
//viewAllRoles function is used to display all the roles in the database from the role table
//the pool.query function is used to send a query to the database and return the result
const viewAllRoles = async () => {
  const res = await pool.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id');
  console.table(res.rows);
  mainMenu();
};
//viewAllEmployees function is used to display all the employees in the database from the employee table
//console.table(res.rows) is used to display the result in a table format
const viewAllEmployees = async () => {
  const res = await pool.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id');
  console.table(res.rows);
  mainMenu();
};
//addDepartment function is used to add a department to the database
//inquirer.prompt is used to prompt the user to enter the name of the department
//pool.query is used to insert the department name into the department table
//console.log is used to display a message that the department has been added to the database
const addDepartment = async () => {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]);
//the await keyword is used to wait for the promise to be resolved before continuing with the execution
//the pool.query function is used to send a query to the database and return the result
//the INSERT INTO department (name) VALUES ($1) query is used to insert the department name into the department table
//[name] is used to pass the value of the department name to the query
  await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
  console.log(`Added ${name} to the database`);
  mainMenu();
};
//addRole function is used to add a role to the database
//const departments = await pool.query(‘SELECT * FROM department’) is used to get all the departments from the department table
//departmentChoices is used to map the department id and name to an array of objects
const addRole = async () => {
  const departments = await pool.query('SELECT * FROM department');
  const departmentChoices = departments.rows.map(department => ({
    name: department.name,
    value: department.id,
  }));
//inquirer.prompt is used to prompt the user to enter the title, salary, and department for the role
//departmentChoices is used as the choices for the department selection
  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the name of the role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary of the role:',
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department for the role:',
      choices: departmentChoices,
    },
  ]);
//the await keyword is used to wait for the promise to be resolved before continuing with the execution
//insert the role into the role table using the INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) query
//[title, salary, department_id] is used to pass the values of the title, salary, and department id to the query
  await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
  console.log(`Added ${title} to the database`);
  mainMenu();
};
//addEmployee function is used to add an employee to the database
//const roles = await pool.query(‘SELECT * FROM role’) is used to get all the roles from the role table
//roleChoices is used to map the role id and title to an array of objects
const addEmployee = async () => {
  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id,
  }));
//const employees = await pool.query(‘SELECT * FROM employee’) is used to get all the employees from the employee table
//managerChoices is used to map the employee id and name to an array of objects
//managerChoices.push({ name: ‘None’, value: null }) is used to add an option for no manager
  const employees = await pool.query('SELECT * FROM employee');
  const managerChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  managerChoices.push({ name: 'None', value: null });
//const { first_name, last_name, role_id, manager_id } = await inquirer.prompt is used to prompt the user to enter the first name, last name, role, and manager for the employee
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the first name of the employee:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the last name of the employee:',
    },
    {
      type:     'list',
      name:  'role_id',
      message: 'Select the role for the employee:',
      choices: roleChoices,
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select the manager for the employee',
      choices: managerChoices,
    },
  ]);
//first_name, last_name, role_id, manager_id are passed to the INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) query
  await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
  console.log(`Added ${first_name} ${last_name} to the database`);
  mainMenu();
};
//updateEmployeeRole function is used to update the role of an employee in the database
//const employees = await pool.query(‘SELECT * FROM employee’) is used to get all the employees from the employee table
//employeeChoices is used to map the employee id and name to an array of objects
const updateEmployeeRole = async () => {
  const employees = await pool.query('SELECT * FROM employee');
  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
//const roles = await pool.query(‘SELECT * FROM role’) is used to get all the roles from the role table
//roleChoices is used to map the role id and title to an array
  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id,
  }));
//const { employee_id, role_id } = await inquirer.prompt is used to prompt the user to select the employee and the new role for the employee
//employeeChoices is used as the choices for the employee selection
//roleChoices is used as the choices for the role selection
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to update:',
      choices: employeeChoices,
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the new role for the employee:',
      choices: roleChoices,
    },
  ]);
//[role_id, employee_id] is used to pass the values of the role id and employee
  await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
  console.log(`Updated employee's role`);
  mainMenu();
};

mainMenu();

