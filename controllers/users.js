const store = require('../store/users');

function getUsers(buscar){
    return new Promise(( resolve, reject) => {
        resolve(store.list(buscar))
    })
}

function getById(id) {
    return new Promise((resolve, reject) => {
        resolve(store.get(id))
    })
}

function getImagen(id) {
    return new Promise((resolve, resject) => {
        resolve(store.imagen(id));
    });
};

module.exports = {
    getUsers,
    getById,
    getImagen,
}
