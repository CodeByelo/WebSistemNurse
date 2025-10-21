require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();               // <-- debe estar definido ANTES de usar app
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as hora');
    res.send(`Backend conectado! Hora DB: ${result.rows[0].hora}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error DB: ' + error.message);
  }
});

app.post("/api/pacientes", async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, carnet, carrera } = req.body;
    console.log("📥 Datos recibidos:", req.body);

    const query = `
      INSERT INTO pacientes (nombre, apellido, cedula, email, telefono, carrera_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const params = [nombre, apellido, carnet, email, telefono, carrera || 1];

    console.log("SQL:", query.replace(/\s+/g,' '));
    console.log("params:", params);

    const result = await pool.query(query, params);

    console.log("✅ Insert result:", result.rows[0]);
    res.status(201).json({ success: true, paciente: result.rows[0] });
  } catch (error) {
    console.error("❌ ERROR BACKEND (stack):", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => console.log(`Servidor listo en http://localhost:${port}`));