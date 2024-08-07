// Importa las dependencias necesarias
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
const helmet = require('./config/helmet');

// Inicializa la aplicación Express
const app = express();
require('./lib/passport');

// Configuración de la aplicación
app.set('port', process.env.PORT || 4000); // si existe otro usalo
app.set('views',path.join(__dirname, 'views'));// devuelve directorio donde esta la carpeta views
app.engine('.hbs', engine({
    defaultlayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), 
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs')

// Configura el middleware de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // aceptar datos de formulario
app.use(flash());
app.use(express.json()); 
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet);

// Middleware para variables globales en las vistas
app.use((req,res,next) =>{
    app.locals.success = req.flash('success'); 
    app.locals.error = req.flash('error'); 
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Configura las rutas de la aplicación
app.use(require('./routes'));
app.use(require('./routes/authentication')); 
app.use('/links',require('./routes/links')); 

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))) 

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Inicia el servidor
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port')); 
})


