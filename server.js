const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PUERTO = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.post('/api/registro', (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Todos los campos son obligatorios'
    });
  }

  try {
    const sentencia = db.prepare(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)'
    );

    const resultado = sentencia.run(nombre, email, password);

    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente',
      id: resultado.lastInsertRowid
    });

  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({
        ok: false,
        mensaje: 'Ese email ya está registrado'
      });
    }

    console.error('Error al insertar:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor'
    });
  }
});

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});