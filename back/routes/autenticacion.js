// Imports previos
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Config del router (app)
const router = express.Router();
router.use(cors())
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Lista de EPs
router.get('/getPasswordEncriptada', (req, res) => {
    const passwordPlano = 'NuevaContrasenyaEncriptada';
    const saltRounds = 10;
    bcrypt.hash(passwordPlano, saltRounds, (err, hash) => {
        res.json(err ? 'Error' : hash)
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(500).json({ error: "Email y contraseña son obligatorios" });
    }

    let query = "SELECT IdUsuario, Nombre, Apellidos, Email, Password FROM Usuarios WHERE Email = ? LIMIT 1";

    db.query(query, [email], async (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error en el servidor" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const usuario = results[0];

        const passwordMatch = await bcrypt.compare(password, usuario.Password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        res.status(200).json({ idUsuario: usuario.IdUsuario, nombreCompleto: usuario.Nombre + " " + usuario.Apellidos });
    });
});


module.exports = router;
