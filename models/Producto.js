const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: String,
    cantidadDisponible: { type: Number, required: true, min: 0 },
    // Precio para alquiler del producto
    precioUnitario: { type: Number, required: true, min: 0 },
    // Costo real que pagó la empresa
    costoCompra: { type: Number, required: true, min: 0 },
    // Costo que se cobra por alquilar (podría coincidir con precioUnitario o ser distinto)
    costoAlquiler: { type: Number, required: true, min: 0 },
    imagenes: [String],
    // Auditoría
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    actualizadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  },
  { timestamps: true }
); // Esto ya agrega createdAt y updatedAt automáticamente

module.exports = mongoose.model("Producto", ProductoSchema);
