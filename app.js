const express = require('express');
const path = require('path');
const config = require('./config');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginoutRouter = require('./routes/login');
const preguntasRouter = require('./routes/preguntar');


const app = express();
require('./lib/passport');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'awucm404',
    resave: false,
    saveUninitialized: false
  }));
app.use(flash());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


app.use('/',indexRouter);
app.use('/loginout', loginoutRouter)
app.use('/users', usersRouter);
app.use('/preguntas', preguntasRouter);


app.listen(config.port, (err)=> {
  if (err) {
    console.log(`Error al abrir el puerto ${config.port}`);
  } else {
    console.log(`Servidor escuchando en ${config.host}:${config.port}`);
  }
});
