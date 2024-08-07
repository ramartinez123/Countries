const express = require('express');
const router = express.Router();
const connection = require ('../config/database');
const {isLoggedIn} = require('../lib/auth');

// Renderiza la página para agregar un nuevo enlace
router.get('/add', (req,res) =>{
    res.render('links/add');
});

// Agrega un país a la base de datos
router.post('/add', isLoggedIn, async (req, res) => {
    try {
        const { country, capital, population, continent } = req.body;
        
        // Verifica si el país ya existe en la base de datos
        const existingCountry = await connection.query('SELECT * FROM countries WHERE country = ?', [country]);
        if (existingCountry.length > 0) {
            req.flash('error', 'Pais ya existe');
            return res.redirect('/links/listAll');
        }

       // Valida que population sea un número
       if (isNaN(population) || population <= 0) {
        req.flash('error', 'Population debe ser un número positivo');
        return res.redirect('/links/add');
    }
        // Inserta el nuevo país en la base de datos
        await connection.query('INSERT INTO countries (country, capital, population, continent) VALUES (?, ?, ?, ?)', [country, capital, population, continent]);
        req.flash('success', 'Pais Agregado correctamente');
        res.redirect('/links/listAll');
    } catch (error) {
        console.error('Error agregando el pais:', error);
        req.flash('error', 'Error agrgando el pais');
        res.redirect('/links/listAll');
    }
});
// Lista los enlaces del usuario autenticado
router.get('/list', isLoggedIn, async (req, res) => {
    try {
        const consul = await connection.query('SELECT * FROM country WHERE user_id = ?', [req.user.id]);
        res.render('links/list', { consul });
    } catch (error) {
        console.error('Error fetching user links:', error);
        req.flash('error', 'Error fetching links');
        res.redirect('/');
    }
});

// Lista todos los países que no están asignados al usuario autenticado
router.get('/listAll', isLoggedIn, async (req, res) => {
    try {
        // Esta consulta obtiene todos los países que no están asociados con el usuario actual
        const consulAll = await connection.query(`
            SELECT counts.id, counts.country, counts.capital, counts.population, counts.continent
            FROM countries AS counts
            LEFT JOIN country AS coun ON counts.id = coun.id_country AND coun.user_id = ?
            WHERE coun.id_country IS NULL
        `, [req.user.id]);

        res.render('links/listAll', { consulAll });
    } catch (error) {
        console.error('Error fetching all countries:', error);
        req.flash('error', 'Error fetching countries');
        res.redirect('/');
    }
});

// Elimina un país de la base de datos
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    
    try {
        const { id } = req.params;
        // Asegúrate de que id es un número entero
        if (isNaN(id) || !Number.isInteger(parseInt(id))) {
            req.flash('error', 'Debe ingresar un numero');
            return res.redirect('/links/list');
        }
    
        await connection.query('DELETE FROM country WHERE ID = ?', [id]);
        req.flash('success', 'Tarjeta borrada correctamente');
        res.redirect('/links/list');
    } catch (error) {
        console.error('Error deleting country:', error);
        req.flash('error', 'Error al borrar la tarjeta');
        res.redirect('/links/list');
    }
});

// Agrega un país a la lista del usuario autenticado
router.get('/addCountry/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const consul2 = await connection.query('SELECT * FROM countries WHERE id = ?', [id]);

        if (consul2.length === 0) {
            req.flash('error', 'Pais no Encontrado');
            return res.redirect('/links/listAll');
        }

        // Verifica si el país ya está asociado al usuario
        const existingCountry = await connection.query('SELECT * FROM country WHERE id_country = ? AND user_id = ?', [id, req.user.id]);
        if (existingCountry.length > 0) {
            req.flash('error', 'Pais ya agregado');
            return res.redirect('/links/listAll');
        }

        const newCountry = {
            id_country: id,
            country: consul2[0].country,
            capital: consul2[0].capital,
            population: consul2[0].population,
            continent: consul2[0].continent,
            user_id: req.user.id
        };

        await connection.query('INSERT INTO country SET ?', [newCountry]);
        req.flash('success', 'Pais agregado correctamente');
        res.redirect('/links/listAll');
    } catch (error) {
        console.error('Error adding country:', error);
        req.flash('error', 'Error agregando el pasi');
        res.redirect('/links/listAll');
    }
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