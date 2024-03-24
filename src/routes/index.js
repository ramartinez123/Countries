const express = require('express');
const router = express.Router(); // crea objeto

router.get('/', async (req,resp) =>{
    resp.send ('Hello');
});

module.exports = router;