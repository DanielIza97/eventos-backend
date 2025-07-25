const mongoose = require("mongoose");

const MovimientoInventarioSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    tipo: { type: String, enum: ["entrada", "salida"], required: true },
    cantidad: { type: Number, required: true, min: 1 },
    descripcion: String,
    realizadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "MovimientoInventario",
  MovimientoInventarioSchema
);
