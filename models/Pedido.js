const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidad: { type: Number, required: true, min: 1 },
    eventoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento",
      required: true,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "preparado", "entregado"],
      default: "pendiente",
    },
    cantidadFaltante: { type: Number, default: 0 },
    valorCobroFaltante: { type: Number, default: 0 },
    observacion: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pedido", PedidoSchema);
