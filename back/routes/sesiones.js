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
router.get('/getSesiones/:idUsuario', (req, res) => {
    let idUsuario = req.params.idUsuario;

    let query = `
        SELECT 
            L.Titulo AS NombreLibro, 
            S.Duracion, 
            S.PaginasLeidas, 
            S.Notas
        FROM Sesiones S
        JOIN Libros L ON S.IdLibro = L.IdLibro
        WHERE S.IdUsuario = ?;
    `;

    db.query(query, [idUsuario], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

module.exports = router;
