const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: String,
    cantidadDisponible: { type: Number, required: true, min: 0 },
    costoCompra: { type: Number, required: true, min: 0 },
    costoAlquiler: { type: Number, required: true, min: 0 },
    imagenes: [String],
    // Auditoría
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    actualizadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Producto", ProductoSchema);
