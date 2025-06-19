// models/Producto.js
const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  cantidadDisponible: { type: Number, required: true, min: 0 },
  precioUnitario: { type: Number, required: true, min: 0 },
  imagenes: [String],
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
});

ProductoSchema.pre('save', function(next) {
  this.actualizadoEn = Date.now();
  next();
});

module.exports = mongoose.model('Producto', ProductoSchema);
