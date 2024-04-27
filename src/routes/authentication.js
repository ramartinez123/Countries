const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {body, validationResult} = require('express-validator');

// SIGNUP
router.get('/signup', isNotLoggedIn, (req, res) => {  //randerizar 
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {  //recibir datos
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');  
});

router.get('/signin', isNotLoggedIn, (req, res) => {
  res.render('auth/signin');  
});

router.post('/signin', 
[
  [
    body('username').notEmpty(),
    body('password').notEmpty(),
  ],
],
  async (req,res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       req.flash('message', 'one or more fields are incomplete');
    }

    passport.authenticate('local.signin', {
      successRedirect: '/profile',
      failureRedirect: '/signin',
      failureFlash: true
    })(req, res, next);

router.get("/logout", (req, res) => {
  req.logOut(req.user, err => {
  if(err) return next(err);
    res.render('auth/signin');
      });

router.get('/profile',isLoggedIn,(req, res) => {
  res.render('profile');
      })
    });
})

module.exports = router;

