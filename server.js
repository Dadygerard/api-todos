const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.json());

// Conexión SQLite
const db = new sqlite3.Database('./database.db');

// Crear tabla si no existe
db.run(`
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Ruta principal
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Agregar tarea
app.post('/agrega_todo', (req, res) => {

    const { todo } = req.body;

    if (!todo) {
        return res.status(400).json({
            error: 'El campo todo es obligatorio'
        });
    }

    db.run(
        'INSERT INTO todos (todo) VALUES (?)',
        [todo],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: 'Error al guardar'
                });
            }

            res.status(201).json({
                mensaje: 'Todo guardado correctamente',
                id: this.lastID
            });

        }
    );

});

// Obtener tareas
app.get('/todos', (req, res) => {

    db.all(
        'SELECT * FROM todos',
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: 'Error al obtener datos'
                });
            }

            res.json(rows);

        }
    );

});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
