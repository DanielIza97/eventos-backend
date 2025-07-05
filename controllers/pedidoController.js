const Pedido = require("../models/Pedido");
const Producto = require("../models/Producto");

// --- FUNCION: registrarFaltantes ---
exports.registrarFaltantes = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { cantidadFaltante, observacion } = req.body;

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

    const valorCobroFaltante = cantidadFaltante * producto.costoCompra;

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

// --- FUNCION: crearPedido ---
exports.crearPedido = async (req, res) => {
  try {
    const { id: eventoId } = req.params;
    const { producto, cantidad } = req.body;

    if (!producto || !cantidad) {
      return res
        .status(400)
        .json({ mensaje: "Producto y cantidad son obligatorios" });
    }

    const nuevoPedido = new Pedido({
      producto,
      cantidad,
      eventoId,
      creadoPor: req.user.id,
    });

    await nuevoPedido.save();

    return res.status(201).json({
      mensaje: "Pedido creado exitosamente",
      pedido: nuevoPedido,
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ mensaje: "Error del servidor", error });
  }
};

// --- FUNCION: obtenerPedidosPorEvento ---
exports.obtenerPedidosPorEvento = async (req, res) => {
  try {
    const { id: eventoId } = req.params;

    const pedidos = await Pedido.find({ eventoId }).populate("producto");

    res.json({ pedidos });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ mensaje: "Error del servidor", error });
  }
};
