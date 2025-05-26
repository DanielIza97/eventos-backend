const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  correo: String,
  direccion: String,
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
