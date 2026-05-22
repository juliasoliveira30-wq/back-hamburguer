const express = require('express');
const router = express.Router();
const db = require('../data/database');

router.get('/', (req, res) => {
    res.json(db.categorias);
});

router.post('/', (req, res) => {
    const novaCategoria = {
        id: db.categorias.length + 1,
        nome: req.body.nome
    };
    db.categorias.push(novaCategoria);
    res.status(201).json(novaCategoria);
});

module.exports = router;

//Url: http://localhost:3000/categorias
//Metodos: GET, POST, PUT, DELETE

