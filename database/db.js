const mysql = require("mysql");
const config = require("../config");
const {promisify} = require('util');

const dbconf = {
    host: config.mysql.host,
    database: config.mysql.database,
    user: config.mysql.user,
    password: config.mysql.password

};

const pool =mysql.createPool(dbconf);
pool.getConnection((err, connection) => {
    if(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Conexion perdida');
        }

        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La bd tiene muchas conexiones');
        }

        if(err.code === 'ECONNREFUSED') {
            console.error('Conexion refusada');
        }
    }

    if(connection){
        connection.release();
        console.log('DB conectada');
    }
    return;
});

pool.query = promisify(pool.query); 

module.exports = pool;
