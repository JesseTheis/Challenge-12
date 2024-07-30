const pool = require('./connection');

class DB {
  constructor() {

  }
  async query(query, values) {

    const client = await pool.connect();
    try {
      return await client.query(query, values);
    } catch (err) {
      console.log(err);
    } finally {
      client.release();
    }
  }
  //viewAllDepartments function is used to display all the departments in the database from the department table
  viewAllDepartments() {
    return this.pool.query('SELECT * FROM department');
  }
  //viewAllRoles function is used to display all the roles in the database from the role table
  viewAllRoles() {
    return this.pool.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id');
  }
  //viewAllEmployees function is used to display all the employees in the database from the employee table
  viewAllEmployees() {
    return this.pool.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id');
  }
  //addDepartment function is used to add a department to the department table
  addDepartment(department) {
    return this.pool.query('INSERT INTO department (name) VALUES ($1)', [department]);
  }
  //addRole function is used to add a role to the role table
  addRole(role) {
    return this.pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [role.title, role.salary, role.department_id]);
  }
  //addEmployee function is used to add an employee to the employee table
  addEmployee(employee) {
    return this.pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [employee.first_name, employee.last_name, employee.role_id, employee.manager_id]);
  }
  //updateEmployeeRole function is used to update an employee's role in the employee table
  updateEmployeeRole(employeeId, roleId) {
    return this.pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
  }
}