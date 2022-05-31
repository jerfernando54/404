
const { getImage } = require('../controllers/users');
const pool = require('../database/db');

async function addUser(user){
    await pool.query('INSERT INTO users SET ?', user)
}

async function getUsers(buscar) {
    if(buscar){
        return await pool.query(`SELECT * FROM users WHERE nombre Like '%${buscar}%'`);
    }
    else {
        return await pool.query('SELECT * FROM users');
    }
}

async function getUserById(id) {
    const user = await pool.query('SELECT u.id, u.nombre, u.preguntas, u.respuestas, DATE_FORMAT(u.created_at, "%d-%m-%Y") as created_at FROM users u WHERE u.id=?',[id])
    return user
}

async function getImageById(id) {
    const image = await pool.query('SELECT foto FROM USERS WHERE Id =?', [id])
    return image[0].foto;
}

module.exports = {
    add: addUser,
    list: getUsers,
    get: getUserById,
    imagen:getImageById   
}