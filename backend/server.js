require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express       = require('express');
const mongoose      = require('mongoose');
const cors          = require('cors');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app  = express();
const PORT = 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ── Seguridad ──
app.use(helmet());

app.use(cors({
  origin: [
    'https://adfenesa.web.app',  // reemplazá con tu dominio Firebase real
    'http://127.0.0.1:5500'        // local dev
  ]
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiadas solicitudes, intentá más tarde.' }
});
app.use('/api/contacto', limiter);

app.use(mongoSanitize());
app.use(express.json({ limit: '10kb' }));

// ── Schema y modelo ──
const contactoSchema = new mongoose.Schema({
  nombre:   { type: String, required: true, trim: true },
  email:    { type: String, required: true, trim: true, lowercase: true },
  telefono: { type: String, required: true, trim: true },
  fecha:    { type: Date, default: Date.now },
  atendido: { type: Boolean, default: false }
});

const Contacto = mongoose.model('Contacto', contactoSchema);

// ── Rutas ──
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