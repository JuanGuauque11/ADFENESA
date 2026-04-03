const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3001;

const MONGO_URI = 'mongodb+srv://adfenesa_clientes:TU_Adfenesa_DB_Clientes@adfenesa.uy2if2y.mongodb.net/a_la_medida?appName=adfenesa';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

app.use(cors());
app.use(express.json());

const contactoSchema = new mongoose.Schema({
  nombre:    { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  telefono:  { type: String, required: true, trim: true },
  fecha:     { type: Date, default: Date.now },
  atendido:  { type: Boolean, default: false }
});

const Contacto = mongoose.model('Contacto', contactoSchema);

app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    if (!nombre || !email || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
    const nuevo = new Contacto({ nombre, email, telefono });
    await nuevo.save();
    console.log(`📩 Nuevo contacto: ${nombre} (${email})`);
    res.status(201).json({ mensaje: 'Contacto guardado.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno.' });
  }
});

app.get('/api/contactos', async (req, res) => {
  try {
    const contactos = await Contacto.find().sort({ fecha: -1 });
    res.json(contactos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener contactos.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});