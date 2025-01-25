const mysql = require('mysql2');

const db = mysql
  .createPool({
    host: 'localhost',
    user: 'root',
    password: 'alenjo10',
    database: 'event_management',
  })
  .promise(); 

module.exports = db;
