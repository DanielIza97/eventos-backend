const mongoose = require('mongoose');

const ServicioSchema = new mongoose.Schema({
  nombre: String,
  precioUnitario: Number,
  cantidad: Number
});

const EventoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  nombre: String,
  tipoEvento: String,
  fecha: Date,
  horaInicio: String,
  horaFin: String,
  lugar: String,
  estado: String,
  servicios: [ServicioSchema],
  imagenes: [String],
  total: Number,
  pagado: Number,
  saldo: Number,
  organizadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  observaciones: String,
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evento', EventoSchema);
