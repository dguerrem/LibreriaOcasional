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
            DATE_FORMAT(S.FechaSesion, '%Y-%m-%d') AS date, 
            Libro AS book, 
            CONCAT(S.Duracion, ' minutos') AS duration, 
            S.PaginasLeidas AS pages, 
            IFNULL(S.Notas, '') AS notes
        FROM Sesiones S
        WHERE S.IdUsuario = ?
        ORDER BY S.FechaSesion ASC;
    `;

    db.query(query, [idUsuario], (error, results) => {
        if (error) {
            console.error('Error al obtener sesiones:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
});

router.post('/addSesion', (req, res) => {
    const { fecha, libro, duracion, paginasLeidas, notas, idUsuario } = req.body;

    // 📌 Validación de datos obligatorios
    if (!fecha || !libro || !duracion || !paginasLeidas || !idUsuario) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    let query = `
        INSERT INTO Sesiones (IdUsuario, Libro, Duracion, PaginasLeidas, Notas, FechaSesion)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    let valores = [idUsuario, libro, duracion, paginasLeidas, notas, fecha];

    db.query(query, valores, (error, results) => {
        if (error) {
            console.error('Error al insertar la sesión:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.status(201).json({ message: 'Sesión guardada correctamente', IdSesion: results.insertId });
    });
});

module.exports = router;
