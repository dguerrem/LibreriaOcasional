// Sección Imports (require)
const express = require('express');
const db = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { formatDate } = require('./utils');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/getLibros/:idUsuario', (req, res) => {
    const idUsuario = req.params.idUsuario;
    let query = `
        SELECT 
            L.IdLibro,
            L.Titulo AS NombreLibro,
            L.Portada,
            A.Nombre AS NombreAutor,
            E.Nombre AS Estado,
            L.Puntuacion,
            L.Paginas,
            L.Progreso,
            L.FechaInicio,
            L.FechaFin
        FROM Libros L
        JOIN Autores A ON L.IdAutor = A.IdAutor
        JOIN Estados E ON L.IdEstado = E.IdEstado
        WHERE L.IdUsuario = ?;`;

    db.query(query, [idUsuario], (error, results) => {
        if (error) {
            console.error('Error al obtener los libros:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        // Convertir datos antes de enviar la respuesta
        const libros = results.map(libro => ({
            IdLibro: libro.IdLibro,
            NombreLibro: libro.NombreLibro,
            Portada: libro.Portada,
            NombreAutor: libro.NombreAutor,
            Estado: libro.Estado,
            Puntuacion: (libro.Puntuacion / 10) * 5, // Conversión de 10 a 5 estrellas
            Paginas: libro.Paginas,
            Progreso: libro.Progreso,
            FechaInicio: formatDate(libro.FechaInicio), // Convertir a dd/mm/yyyy
            FechaFin: formatDate(libro.FechaFin) // Convertir a dd/mm/yyyy
        }));

        res.json(libros);
    });
});

app.get('/getPasswordEncriptada', (req, res) => {
    const passwordPlano = 'Sox@1234';
    const saltRounds = 10;
    bcrypt.hash(passwordPlano, saltRounds, (err, hash) => {
        res.json(err ? 'Error' : hash)
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
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son obligatorios" });
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

        // Verificar la contraseña encriptada con bcrypt
        const passwordMatch = await bcrypt.compare(password, usuario.Password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Si todo está bien, enviamos respuesta exitosa
        res.status(200).json({ idUsuario: usuario.IdUsuario, nombreCompleto: usuario.Nombre + " " + usuario.Apellidos });
    });
});

app.get('/getUsuario/:idUsuario', (req, res) => {
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

app.get('/getEstados', (req, res) => {
    let query = `SELECT IdEstado, Nombre FROM Estados ORDER BY Nombre ASC`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los estados:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
});

app.get('/getTapas', (req, res) => {
    let query = `SELECT IdTapa, Nombre FROM Tapas ORDER BY Nombre ASC`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las tapas:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
});

app.get('/getEditoriales', (req, res) => {
    let query = `SELECT IdEditorial, Nombre FROM Editoriales ORDER BY Nombre ASC`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las editoriales:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
});

app.get('/getAutores', (req, res) => {
    let query = `SELECT IdAutor, Nombre FROM Autores ORDER BY Nombre ASC`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los autores:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
