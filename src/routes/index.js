const express = require('express');
const router = express.Router(); // crea objeto

router.get('/', async (req,res) =>{
    res.redirect('signin');
});

module.exports = router;