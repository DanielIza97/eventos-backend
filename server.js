const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const verifyToken = require('./middlewares/verifyToken');

dotenv.config();

const app = express();
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventosdb')
  .then(() => console.log('Conectado a Mongo'))
  .catch(err => console.error('Error conexión Mongo:', err));

app.use((req, res, next) => {
  console.log(`📥 Petición recibida: ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));

// Nuevas rutas
app.use('/api/productos', verifyToken(['admin', 'recepcionista', 'supervisor', 'despachador']), require('./routes/productoRoutes'));
app.use('/api/eventos', verifyToken(['admin', 'recepcionista', 'supervisor', 'despachador']), require('./routes/eventoRoutes'));

// Ruta test básica para verificar servidor levantado
app.get('/ping', (req, res) => res.send('pong'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
