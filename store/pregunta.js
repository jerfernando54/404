const pool = require('../database/db');

async function addPregunta(pregunta){
    await pool.query('INSERT INTO preguntas SET ?', pregunta);
    await incrementarPreguntas(pregunta.id_autor);
}

async function addRespuesta(respuesta) {
    await pool.query('INSERT INTO respuestas SET ?', respuesta);
    await incrementarRespuestas(respuesta.id_autor);
}

async function getPreguntas(buscar) {
    if (buscar) {
        return pool.query(`SELECT p.id, p.titulo, p.cuerpo, p.etiquetas, p.respondida, p.id_autor, DATE_FORMAT(p.created_at, "%d/%m/%Y") as created_at, u.nombre FROM preguntas p JOIN users u WHERE p.id_autor = u.id and (titulo LIKE '%${buscar}%' OR cuerpo LIKE '%${buscar}%')`);

    } else {
        return pool.query('SELECT p.id, p.titulo, p.cuerpo, p.etiquetas, p.respondida, p.id_autor, DATE_FORMAT(p.created_at, "%d/%m/%Y") as created_at, u.nombre FROM preguntas p JOIN users u WHERE p.id_autor = u.id');
    }
    
}

async function getById(id){
    const res = await pool.query('SELECT p.id, p.titulo, p.cuerpo, p.etiquetas, p.respondida, DATE_FORMAT(p.created_at, "%d/%m/%Y") as created_at, p.id_autor, u.nombre FROM preguntas p JOIN users u ON p.id_autor = u.id WHERE p.id =?', [id])
    return res;
}

async function getByEtiqueta(etiqueta) {
    const preguntas = await pool.query(`SELECT p.id, p.titulo, p.cuerpo, p.etiquetas, p.respondida, DATE_FORMAT(p.created_at, "%d/%m/%Y") as created_at, p.id_autor, u.nombre FROM preguntas p JOIN users u ON p.id_autor = u.id WHERE p.etiquetas LIKE '%${etiqueta}%'`);
    return preguntas;
}

async function fitroPorTexto(texto) {
    const res = await pool.query(`SELECT * FROM preguntas WHERE titulo LIKE '%${texto}%' OR cuerpo LIKE '%${texto}%'`);
    return res
}

async function getRespuestas(id){
    const respuestas = await pool.query('SELECT r.id, r.texto, r.id_pregunta, r.id_autor, DATE_FORMAT(r.created_at, "%d/%m/%Y") as created_at, u.nombre FROM respuestas r JOIN users u ON r.id_autor = u.id WHERE id_pregunta =?', [id]);
    return respuestas;
}

async function updateState(id) {
    const update = await pool.query('UPDATE preguntas SET respondida = true WHERE id =?', [id]);
    return update;
}

async function incrementarPreguntas(id) {
    await pool.query('UPDATE users SET preguntas = preguntas + 1 WHERE id =?',[id]);
}

async function incrementarRespuestas(id) {
    await pool.query('UPDATE users SET respuestas = respuestas + 1 WHERE id =?',[id]);
}

module.exports = {
    add: addPregunta,
    addRespuesta: addRespuesta,
    list: getPreguntas,
    getByEtiqueta:getByEtiqueta,
    getById:getById,
    getRespuestas: getRespuestas,
    update: updateState,
    filtroTexto: fitroPorTexto

}