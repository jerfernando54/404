var express = require('express');
var router = express.Router();
const controller = require('../controllers/pregunta');
const { isLoggedIn } = require('../lib/auth');
const response = require('../network/response');
const { check, validationResult } = require("express-validator");

let contVisitas = {}

router.get('/', isLoggedIn, function(req, res, next) {
    controller.getPreguntas(req.query.buscar)
        .then((result) => {
            res.render('preguntas', { title: 'preguntas', preguntas:result, user:req.user});
        })
        .catch((err) => {
            response.error(req, res, 'Internal Error', 500, err)
        })
});


router.get('/formular',isLoggedIn, function(req, res, next) {
    const error = validationResult(req)
    //res.render('formular');
    res.render('formular', { title: 'formular', user:req.user, error: error.mapped() });
});

router.get('/sinresponder',isLoggedIn, function(req, res, next) {
    controller.getPreguntas()
        .then((result) => {
            res.render('sinresponder', { title: 'sin responder', preguntas:result, user:req.user });
        })
        .catch((err) => {
            response.error(req, res, 'Internal Error', 500, err)
        })
});

router.get('/:id', isLoggedIn, function(req, res) {
    const error = validationResult(req)
    controller.getById(req.params.id)
    .then((result) => {
       req.session.visita = req.session.visita ? req.session.visita + 1 : 1
        if (contVisitas[req.params.id]) {
            contVisitas[req.params.id] ++;
        } else {
            contVisitas[req.params.id] = 1; 
        }
        
        controller.getRespuestas(req.params.id)
        .then((resp) => {
            res.render('pregunta', {title: "", pregunta: result, respuesta: resp, user:req.user, visitas: contVisitas[req.params.id], error: error.mapped()})
        })
        .catch((err) => {response.error(req, res, 'Internal Error', err)})
    })
    .catch(e =>{
        response.error(req, res, 'Error en el controller',e)
    })
})

router.post('/publicar', isLoggedIn, 
    check("titulo", "El titulo es obligatorio").notEmpty(),
    check("cuerpo", "Escriba una descripcion de la pregunta").notEmpty(),
    (req, res)=> {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            controller.addPregunta(req.body.titulo, req.body.cuerpo, req.body.etiqueta, req.user.id)
                .then((question) => {
                    res.redirect('/preguntas')
                })
                .catch(e => {
                    response.error(req, res, 'Internal error', 500, e)
                })
        } else {
            //res.redirect('/preguntas/formular');
            res.render('formular', {title: 'formular', user:req.user, error: errors.mapped()});
        }
});

router.post('/respuesta/:id', isLoggedIn,
    check("cuerpo", "Escriba una descripcion de la respuesta").notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            controller.addRespuesta(req.body.cuerpo, req.params.id, req.user.id)
                .then((result) => {
                    const id = req.params.id
                    res.redirect('/preguntas/'+id);
                })
                .catch(e => {
                    response.error(req, res, 'Internal error', 500, e)
                }
            )
        } else {
            //res.redirect('/preguntas/'+req.params.id);
            controller.getById(req.params.id)
            .then((result) => {
                controller.getRespuestas(req.params.id)
                .then((resp) => {
                    //res.render('pregunta', {title: "", pregunta: result, respuesta: resp, user:req.user, visitas: contVisitas[req.params.id], error: error.mapped()})
                    res.render('pregunta', {title: "", pregunta: result, respuesta: resp, user:req.user, visitas: contVisitas[req.params.id], error: errors.mapped()})
                })
                .catch((err) => {response.error(req, res, 'Internal Error', err)})
            })
            .catch(e =>{
                response.error(req, res, 'Error en el controller',e)
            })
    }
});

router.get('/etiquetadas/:etiqueta', isLoggedIn, function(req, res) {
    controller.getByEtiqueta("@"+req.params.etiqueta)
    .then((result) => {
        res.status(200);
        res.render('preguntas', { title: 'Preguntas', preguntas:result, user:req.user });
    })
    .catch(e => {
        response.error(req, res, 'Internal error', 500, e)
    })
});

module.exports = router;