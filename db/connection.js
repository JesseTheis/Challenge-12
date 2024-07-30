const {pool} = require('pg');

const pool = new Pool({
    host : 'localhost',
    user : 'postgres',
    password : 'Sk8board',
    database : 'employee_db',
    port : 5432
});
module.exports = pool;