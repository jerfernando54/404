const express = require('express');
const router = express.Router();
const controller = require('../controllers/pregunta');
const { isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const response = require('../network/response');

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.get('/index', isLoggedIn, function(req, res, next) {
    if(req.isAuthenticated){
        controller.getPreguntas()
        .then((result) => {
            res.status(200)
            res.render('index', { title: 'Inicio', preguntas: result, user: req.user})
        })
           
        .catch((err) => {
            response.error(req, res, 'Internal Error', 500)
        })
    }
    
})

module.exports = router;