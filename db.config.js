const mysql =  require('mysql2');
const dot_env = require('dotenv');

dot_env.config();


const connection = mysql.createPool({
    host : process.env.DBHOST,
    user : process.env.DBUSER,
    password : process.env.DBPASS,
    database : process.env.DBNAME
});

module.exports = connection.promise();