const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const { body, validationResult } = require('express-validator');

// SIGNUP

// Renderiza la página de registro
router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('auth/signup');
});

// Maneja el formulario de registro
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SIGNIN

// Renderiza la página de perfil (requiere autenticación)
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

// Renderiza la página de inicio de sesión
router.get('/signin', isNotLoggedIn, (req, res) => {
  res.render('auth/signin');
});

// Maneja el formulario de inicio de sesión
router.post('/signin', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('message', 'One or more fields are incomplete');
    return res.redirect('/signin'); // Redirige al formulario de inicio de sesión si hay errores
  }

  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

// LOGOUT

// Maneja el cierre de sesión
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/signin'); // Redirige a la página de inicio de sesión después de cerrar sesión
  });
});

module.exports = router;

