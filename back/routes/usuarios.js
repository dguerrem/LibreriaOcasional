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
router.get('/getUsuario/:idUsuario', (req, res) => {
    const idUsuario = req.params.idUsuario;

    // Validar que se recibió el parámetro
    if (!idUsuario) {
        return res.status(400).json({ error: 'El parámetro idUsuario es obligatorio.' });
    }

    let query = `
        SELECT Nombre, Apellidos, FechaNacimiento, Email, Telefono
        FROM Usuarios
        WHERE IdUsuario = ?;
    `;

    db.query(query, [idUsuario], (error, results) => {
        if (error) {
            console.error('Error al obtener el usuario:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        let usuario = results[0];
        usuario.FechaNacimiento = formatDate(usuario.FechaNacimiento);

        res.json(usuario);
    });
});


module.exports = router;
