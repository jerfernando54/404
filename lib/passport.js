const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('./helpers');
const pool = require('../database/db');
const config = require('../config')
const path = require("path");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './public/files',
  filename: function(req, file, cb){
    cb(null, file.fieldname +'-'+ Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage
}).single('file');

passport.use('local.registro', new LocalStrategy({
    emailField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, correo, password, done) => {
    const { confirPass } = req.body;
    if(confirPass != password) {
      console.log("the passwords do not match")
      return done(null, false);
    }
    else {

      const newUser = {
        correo,
        password,
        nombre: req.body.showname,
        foto: req.file.buffer
      }
      newUser.password = await helpers.encryptPassword(password);
      const result = await pool.query('INSERT INTO users SET ? ', newUser);
      newUser.id = result.insertId;
      return done(null, newUser);
    }  

}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE correo = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password)
        if (validPassword) {
          done(null, user, req.flash('success', 'Welcome ' + user.username));
          
        } else {
          done(null, false, req.flash('message', 'Incorrect Password'));
        }
      } else {
        return done(null, false, req.flash('message', 'The Username does not exists.'));
      }
   
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});