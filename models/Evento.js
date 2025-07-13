const mongoose = require("mongoose");

const ProductoRecogidoSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
  cantidadRecogida: { type: Number, default: 0 },
});

const EventoSchema = new mongoose.Schema({
  nombreCliente: { type: String, required: true },
  tipoEvento: { type: String, default: "pedido" },
  fechaEvento: { type: Date, required: true },
  lugar: String,
  estado: {
    type: String,
    enum: ["pendiente", "organizando", "completo", "entregado", "cancelado"],
    default: "pendiente",
  },
  recepcionistaId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  despachadorId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  productosRecogidos: [ProductoRecogidoSchema],
  observaciones: String,
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now },
});

EventoSchema.pre("save", function (next) {
  this.actualizadoEn = Date.now();
  next();
});

module.exports = mongoose.model("Evento", EventoSchema);
