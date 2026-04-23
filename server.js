const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

// Conexión a la base de datos
const db = new sqlite3.Database('./database.db');

// Crear tabla si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Endpoint
app.post('/agrega_todo', (req, res) => {
    const { todo } = req.body;

    if (!todo) {
        return res.status(400).json({
            error: 'El campo todo es obligatorio'
        });
    }

    const query = `INSERT INTO todos (todo) VALUES (?)`;

    db.run(query, [todo], function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Error al guardar'
            });
        }

        res.status(201).json({
    mensaje: 'Todo guardado correctamente',
    id: this.lastID

        });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});