const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "libreria_virtual"
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Error conectando a la base de datos:", err);
    } else {
        console.log("✅ Conectado a la base de datos");
        connection.release();
    }
});

module.exports = pool;