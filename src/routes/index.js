const express = require('express');
const router = express.Router();

router.get('/', async (req,resp) =>{
    resp.send ('Hello');
});

module.exports = router;