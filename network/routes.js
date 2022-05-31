const express = require('express');
const users = require('../routes/users')
const index = require('../routes/index')
const login = require('../routes/login')
const preguntas = require('../routes/preguntar')

const routes = function (server) {

    server.use('/', index)
    server.use('/user', users);
    server.use('loginout', login)
    server.use('preguntas', preguntas);
}

module.exports = routes;