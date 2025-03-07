// Imports previos
const express = require('express');
const multer = require('multer');
const cors = require('cors');

// Imports config
const { formatDate } = require('../config/utils');
const db = require('../config/db');

// Config del SFTP
const upload = multer({ dest: 'uploads/' });
const remotePath = process.env.REMOTE_PATH;
const SftpClient = require('ssh2-sftp-client');
const sftpConfig = {
    host: process.env.SFTP_HOST,
    port: process.env.SFTP_PORT,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
};

// Config del router (app)
const router = express.Router();
router.use(cors())
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Lista de EPs
router.get('/getLibros/:idUsuario', (req, res) => {
    const idUsuario = req.params.idUsuario;
    let query = `
        SELECT 
            L.IdLibro,
            L.Titulo AS NombreLibro,
            L.Portada,
            L.Autor AS NombreAutor,
            E.Nombre AS Estado,
            L.Puntuacion,
            L.Paginas,
            L.Progreso,
            L.FechaInicio,
            L.FechaFin
        FROM Libros L
        JOIN Estados E ON L.IdEstado = E.IdEstado
        WHERE L.IdUsuario = ? 
        ORDER BY L.Titulo ASC;`;

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

router.post('/addLibro', upload.single('portada'), async (req, res) => {
    const {
        idUsuario,
        titulo,
        autor,
        editorial,
        tapa,
        estado,
        paginas,
        progreso,
        precio,
        fechaInicio,
        fechaFin,
        puntuacion
    } = req.body;

    // 📌 Generar el nombre del archivo en CamelCase con extensión .png
    const remoteFileName = `${toCamelCase(titulo)}.png`;
    const remoteFilePath = remotePath + remoteFileName; // Ruta en el servidor remoto

    const sftp = new SftpClient();
    const localFilePath = req.file.path; // Ruta temporal en local

    try {
        await sftp.connect(sftpConfig);
        await sftp.put(localFilePath, remoteFilePath); // Subir archivo
        await sftp.end();

        // 📌 Construcción dinámica de la consulta SQL
        let campos = ['Titulo', 'Autor', 'IdEditorial', 'IdTapa', 'IdEstado', 'IdUsuario', 'Paginas', 'Portada'];
        let valores = [titulo, autor, editorial, tapa, estado, idUsuario, paginas, remoteFileName]; // Solo guarda el nombre

        if (progreso !== undefined && progreso !== '') { campos.push('Progreso'); valores.push(progreso); }
        if (precio !== undefined && precio !== '') { campos.push('Precio'); valores.push(precio); }
        if (fechaInicio) { campos.push('FechaInicio'); valores.push(fechaInicio); }
        if (fechaFin) { campos.push('FechaFin'); valores.push(fechaFin); }
        if (puntuacion !== undefined && puntuacion !== '') { campos.push('Puntuacion'); valores.push(puntuacion); }

        let placeholders = campos.map(() => '?').join(', ');
        let query = `INSERT INTO Libros (${campos.join(', ')}) VALUES (${placeholders})`;

        // 📌 Insertar en la BD solo si la imagen se subió correctamente
        db.query(query, valores, (error, results) => {
            if (error) {
                console.error('Error al insertar el libro:', error);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            res.status(201).json({
                message: 'Libro agregado correctamente',
                IdLibro: results.insertId,
                Portada: remoteFileName // Solo devuelve el nombre del archivo
            });
        });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
});

router.delete('/deleteLibro/:idLibro', async (req, res) => {
    const { idLibro } = req.params;

    if (!idLibro) return res.status(400).json({ error: 'Falta el ID del libro' });

    try {
        // 📌 Obtener el nombre de la portada antes de eliminar el libro
        let queryPortada = `SELECT Portada FROM Libros WHERE IdLibro = ?;`;
        db.query(queryPortada, [idLibro], async (error, results) => {
            if (error) return res.status(500).json({ error: 'Error al obtener la portada del libro' });

            const portada = results.length > 0 ? results[0].Portada : null;

            // 📌 Eliminar sesiones relacionadas
            let deleteSesionesQuery = `DELETE FROM Sesiones WHERE IdLibro = ?;`;
            db.query(deleteSesionesQuery, [idLibro], (error) => {
                if (error) return res.status(500).json({ error: 'Error al eliminar sesiones asociadas' });

                // 📌 Eliminar el libro de la BD
                let deleteLibroQuery = `DELETE FROM Libros WHERE IdLibro = ?;`;
                db.query(deleteLibroQuery, [idLibro], async (error) => {
                    if (error) return res.status(500).json({ error: 'Error al eliminar el libro' });

                    // 📌 Si el libro tiene una portada, eliminar la imagen en HelioHost
                    if (portada) {
                        const sftp = new SftpClient();
                        const remoteFilePath = remotePath + portada;

                        try {
                            await sftp.connect(sftpConfig);
                            await sftp.delete(remoteFilePath);
                            await sftp.end();
                            console.log(`Imagen eliminada: ${portada}`);
                        } catch (err) {
                            console.error('Error al eliminar la imagen en HelioHost:', err);
                        }
                    }

                    return res.status(200).json({ message: 'Libro eliminado correctamente' });
                });
            });
        });
    } catch (error) {
        console.error('Error en la eliminación del libro:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// 📌 Función para convertir el título a CamelCase
const toCamelCase = (str) => {
    return str
        .split(/\s+/) // Divide por espacios
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza cada palabra
        .join(''); // Une sin espacios
};

module.exports = router;
