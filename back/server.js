// Config del app && express
const express = require('express');
const app = express();

// Config del dotenv
const dotenv = require('dotenv');
dotenv.config();

// Config ports
const PORT = process.env.PORT || 3000;

// Routes
app.use('/libros', require('./routes/libros'));
app.use('/autenticacion', require('./routes/autenticacion'));
app.use('/tapas', require('./routes/tapas'));
app.use('/estados', require('./routes/estados'));
app.use('/editoriales', require('./routes/editoriales'));
app.use('/sesiones', require('./routes/sesiones'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/autores', require('./routes/autores'));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
