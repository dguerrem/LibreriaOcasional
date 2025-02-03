// Sección Imports (require)
const express = require('express');
const db = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint: Obtener todos los libros
app.get('/getLibros', (req, res) => {
    let query = 'SELECT * FROM Libros';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los libros:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.get('/getSesiones/:idUsuario', (req, res) => {
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
            console.error('Error al obtener las sesiones:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
