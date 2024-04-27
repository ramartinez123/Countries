const mysql = require('mysql');
const { promisify }= require('util');

const { database } = require('./keys'); // importo archivo database
var connection = mysql.createConnection(database); //crea coneccion

connection.query = promisify(connection.query);

module.exports = connection;



