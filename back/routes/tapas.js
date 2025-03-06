// Imports previos
const express = require('express');
const cors = require('cors');
const db = require('../config/db');

// Config del router (app)
const router = express.Router();
router.use(cors())
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Lista de EPs
router.get('/getTapas', (req, res) => {
    let query = `SELECT IdTapa, Nombre FROM Tapas ORDER BY Nombre ASC`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las tapas:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
});

module.exports = router;
