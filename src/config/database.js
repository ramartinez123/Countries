const mysql = require('mysql');
const { promisify }= require('util'); // Convierte funciones que usan callbacks en funciones que retornan promesas
const { database } = require('../keys');

const pool = mysql.createPool(database); //Conexión única a la base de datos MySQL
pool.query = promisify(pool.query); //Manejo de operaciones asincrónicas

module.exports = pool;



