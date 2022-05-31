const store = require('../store/pregunta');

function addPregunta(titulo, cuerpo, etiquetas, id_autor) {
    return new Promise((resolve, reject) => {
        if(!titulo || !cuerpo){
            console.log('datos incompletos')
            reject('Datos incompletos')
            return false;
        }

        const nuevaPregunta = {
            titulo: titulo,
            cuerpo: cuerpo,
            etiquetas: etiquetas,
            id_autor: id_autor,
            respondida: false
        }
        store.add(nuevaPregunta);
        resolve(nuevaPregunta);
    });
}

function addRespuesta(cuerpo, id_pregunta, id_autor) {
    return new Promise((resolve, reject) => {
        if(!cuerpo){
            console.log('La respuesta es obligatória')
            reject('La respuesta es obligatória')
            return false;
        }

        const respuesta = {
            texto: cuerpo,
            id_pregunta: id_pregunta,
            id_autor: id_autor
        }
        store.addRespuesta(respuesta);
        store.update(id_pregunta)     
        resolve(respuesta);
    })
}

async function getRespuestas(id_pregunta) {
    let res = await store.getRespuestas(id_pregunta)
    return res;
}

async function getPreguntas(buscar){
    let res = await store.list(buscar)
    if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
            res[i].etiquetas = (res[i].etiquetas.split('@'));
        }
    }
    return res;
}

async function getByEtiqueta(etiqueta) {
    let res = await store.getByEtiqueta(etiqueta);
    if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
            res[i].etiquetas = res[i].etiquetas.split('@');
        }
    }
    return res;
}

async function getById(id) {
    let res = await store.getById(id);
    if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
            res[i].etiquetas = (res[i].etiquetas.split('@') || res[i].etiquetas.split('@'));
        }
    }
    return res;
}

module.exports = {
    addPregunta,
    addRespuesta,
    getPreguntas,
    getByEtiqueta,
    getById,
    getRespuestas
}