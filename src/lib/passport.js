const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const connection = require('../config/database');
const helpers = require('./helpers');

// Configura la estrategia de autenticación para el inicio de sesión
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  try {
    const rows = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0]; // Obtiene el primer resultado de la búsqueda
      // Compara la contraseña proporcionada con la almacenada en la base de datos
      const validPassword = await helpers.matchPassword(password, user.password)
      if (validPassword) {
        done(null, user, req.flash('success', 'Welcome ' + user.username));
      } else {
        done(null, false, req.flash('message', 'Incorrect Password'));
      }
    } else {
      return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
  } catch (error) {
    console.error('Error during signin:', error);
    return done(error);
  }
}));

// Configura la estrategia de autenticación para el registro
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  try {
    const { fullname } = req.body;
    let newUser = {
      fullname,
      username,
      password
    };

    // Cifra la contraseña antes de guardar el usuario en la base de datos
    newUser.password = await helpers.encryptPassword(password);

    // Guarda el nuevo usuario en la base de datos
    const result = await connection.query('INSERT INTO users SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);
  } catch (error) {
    console.error('Error durante signup:', error);
    return done(error);
  }
}));

// Configura la serialización del usuario
passport.serializeUser((user, done) => {
  done(null, user.id); // Almacena solo el ID del usuario en la sesión
});

// Configura la deserialización del usuario
passport.deserializeUser(async (id, done) => {
  const rows = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]); // Recupera el usuario completo a partir del ID
});


