const express = require('express');
const router = express.Router();
const connection = require ('../database');
const {isLoggedIn} = require('../lib/auth');



router.get('/add', (req,res) =>{
    res.render('links/add');
});


router.get('/list', async (req,res) =>{
    const consul =await connection.query('SELECT * FROM country WHERE user_id = ?', [req.user.id]);
    res.render('links/list', {consul});
});

router.get('/listAll', async (req,res) =>{
    const consulAll =await connection.query('SELECT counts.id,counts.country,counts.capital,counts.population,counts.continent FROM countries as counts LEFT JOIN country as coun ON counts.id = coun.id_country WHERE coun.user_id <> ? OR coun.user_id IS NULL', [req.user.id]);
    res.render('links/listAll', {consulAll});
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await connection.query('DELETE FROM country WHERE ID = ?', [id]);
    req.flash('success', 'Card Removed Successfully'); // nombre valor
    res.redirect('/links/list');
});

router.get('/addCountry/:id', async (req, res) => {
    const { id } = req.params;  
    const consul2 = await connection.query('SELECT * FROM countries WHERE id = ?', [id]);
    const newCountry = {
        id_country : id,
        country : consul2[0].country,
        capital: consul2[0].capital,
        population : consul2[0].population,   
        continent : consul2[0].continent,
        user_id: req.user.id
    };
    connection.query('INSERT INTO country set?',[newCountry]);
    req.flash('success', ' Added Successfully');
    res.redirect('/links/listAll');

});

module.exports = router;

/*router.get('/edit/:id', async (req, res) => {
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
});*/

/*router.post('/add', async (req,res) =>{
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

})*/