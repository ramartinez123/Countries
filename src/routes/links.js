const express = require('express');
const router = express.Router();
const connection = require ('../database');
const {isLoggedIn} = require('../lib/auth');



router.get('/add', (req,res) =>{
    res.render('links/add');
});

router.post('/add', async (req,res) =>{
    const{country,capital,population,continent} = req.body; //req.body recive datos prop objeto
    const newcountry ={  //guardo en un nuevo objeto
        country,
        capital,
        population,
        continent,
        user_id: req.user.id
    };
   await connection.query('INSERT INTO country set?',[newcountry]);// va a tomar tiempo cuando termine sigue con otroa
   res.redirect('/links/list');

})

router.get('/list', async (req,res) =>{
    const consul =await connection.query('SELECT * FROM country WHERE user_id = ?', [req.user.id]);
    console.log(consul);
    res.render('links/list', {consul});
});


router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await connection.query('DELETE FROM country WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully'); // nombre valor
    res.redirect('/links/list');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const consul = await connection.query('SELECT * FROM country WHERE id = ?', [id]);
    res.render('links/edit', {consul: consul[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { country, capital, population, continent} = req.body; 
    const newLink = {
        country,
        capital,
        population,
        continent
    };
    await connection.query('UPDATE country set ? WHERE id = ?', [newLink, id]);
    req.flash('success', ' Updated Successfully');
    res.redirect('/links/list');
});

module.exports = router;