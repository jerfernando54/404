var express = require('express');
var router = express.Router();
const response = require('../network/response');
const controller = require('../controllers/users');
const { check, validationResult } = require("express-validator");


router.get('/', function (req, res) {
    controller.getUsers(req.query.buscar)
        .then((users) => {
            res.render('usuarios', { title: 'usuarios', usuarios: users, user:req.user });
        }) 
        .catch(e => {
            response.error(req, res, 'Internal error', 500, e)
        })   
});

router.get('/perfil/:id', (req, res, next) => {
    if(req.isAuthenticated){
        controller.getById(req.params.id)
            .then((user)=>{
                console.log(user)
                res.render('perfil', { title: 'Perfil', user:req.user, usuario: user});
            })
            .catch(e => {
                response.error(req, res, 'Internal error', 500, e)
            })  
    } /* else {
        res.send()
    } */
    
});

router.get('/imagen/:id', (req, res) => {
    controller.getImagen(req.params.id)
        .then((image)=>{
            res.end(image)
        })
        .catch((e)=>{
            response.error(req, res, 'Internal error', 500, e)
        })
})
  
module.exports = router;