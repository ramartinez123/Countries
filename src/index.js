// Idem sin Babel
const express = require('express');
const {engine} = require('express-handlebars');
const {body, validationResult} = require('express-validator');
const path = require('path');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const {database} = require('./keys');

//initializations
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4000); // si existe otro usalo

// Idem
app.set('views',path.join(__dirname, 'views'));// devuelve directorio donde esta la carpeta views
app.engine('.hbs', engine({
    defaultlayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),  // esta dentro de views
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs')

//middlewares  cada vez que se envia una peticion al servidor
app.use(session({
    secret: 'este',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // aceptar datos de formulario
app.use(flash());
app.use(express.json()); // recepcion json
app.use(passport.initialize());
app.use(passport.session());
//app.use(query());

//Global variables
app.use((req,res,next) =>{
    app.locals.success = req.flash('success'); //mensajes
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication')); //importar
app.use('/links',require('./routes/links')); 

//Public
app.use(express.static(path.join(__dirname, 'public'))) //carpeta static

//Starting the server
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port')); // concatena
})


