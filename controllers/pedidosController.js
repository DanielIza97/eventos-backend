const Pedido = require("../models/Pedido");
const Producto = require("../models/Producto");

exports.registrarFaltantes = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { cantidadFaltante, observacion } = req.body;

    // Validación básica
    if (cantidadFaltante < 0) {
      return res
        .status(400)
        .json({ mensaje: "La cantidad faltante no puede ser negativa" });
    }

    const pedido = await Pedido.findById(pedidoId);
    if (!pedido)
      return res.status(404).json({ mensaje: "Pedido no encontrado" });

    const producto = await Producto.findById(pedido.producto);
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });

    // Calcular el valor a cobrar
    const valorCobroFaltante = cantidadFaltante * producto.costoCompra;

    // Actualizar el pedido
    pedido.estado = "entregado";
    pedido.cantidadFaltante = cantidadFaltante;
    pedido.valorCobroFaltante = valorCobroFaltante;
    if (observacion) pedido.observacion = observacion;

    await pedido.save();

    return res.json({
      mensaje: "Faltantes registrados exitosamente",
      pedido,
    });
  } catch (error) {
    console.error("Error al registrar faltantes:", error);
    res.status(500).json({ mensaje: "Error del servidor", error });
  }
};
