const Movimiento = require("../models/MovimientoInventario");
const Producto = require("../models/Producto");

exports.registrarMovimiento = async (req, res) => {
  try {
    const { productoId, tipo, cantidad, descripcion } = req.body;

    if (!["entrada", "salida"].includes(tipo)) {
      return res.status(400).json({ error: "Tipo de movimiento inválido" });
    }

    const producto = await Producto.findById(productoId);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });

    let nuevaCantidad = producto.cantidadDisponible;

    if (tipo === "entrada") {
      nuevaCantidad += cantidad;
    } else if (tipo === "salida") {
      if (cantidad > producto.cantidadDisponible) {
        return res
          .status(400)
          .json({ error: "No hay suficiente stock disponible" });
      }
      nuevaCantidad -= cantidad;
    }

    // Registrar el movimiento
    const movimiento = new Movimiento({
      producto: productoId,
      tipo,
      cantidad,
      descripcion,
      realizadoPor: req.user._id,
    });

    await movimiento.save();

    // Actualizar stock
    producto.cantidadDisponible = nuevaCantidad;
    producto.actualizadoPor = req.user._id;
    await producto.save();

    res.status(201).json({ movimiento, productoActualizado: producto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerMovimientosPorProducto = async (req, res) => {
  try {
    const { productoId } = req.params;
    const movimientos = await Movimiento.find({
      producto: productoId,
    }).populate("realizadoPor", "nombre");
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
