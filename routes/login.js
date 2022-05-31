var express = require('express');
const multer = require('multer');
const { isNotLoggedIn } = require('../lib/auth');
const { check, validationResult } = require("express-validator");

const router = express.Router();
const passport = require('passport');

const multerFactory = multer({
    storage: multer.memoryStorage()
})

router.get('/login', isNotLoggedIn, function(req, res, next) {
    res.render('login', { title: '404 - Login' });
});

router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/index',
    failureRedirect: '/loginout/login',
    failureFlash: true
}));

router.get('/registro', function(req, res, next){
    res.render('registro', { title: 'Registrar usuario' });
});

router.post('/nuevo', multerFactory.single('foto'), passport.authenticate('local.registro', {
    successRedirect: '/loginout/login',
    failureRedirect: '/loginout/registro',
    failureFlash: true
}), (req, res)=>{console.log(req.file.originalname)});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/loginout/login');
})

module.exports = router;