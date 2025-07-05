const express = require("express");
const router = express.Router();

const pedidoController = require("../controllers/pedidoController");
const {
  verificarToken,
  verificarRol,
} = require("../middlewares/verificarToken");

// Crear un pedido asociado a un evento
router.post("/evento/:id", verificarToken, pedidoController.crearPedido);

// Obtener todos los pedidos de un evento
router.get(
  "/evento/:id",
  verificarToken,
  pedidoController.obtenerPedidosPorEvento
);

// Registrar faltantes
router.put(
  "/faltantes/:pedidoId",
  verificarToken,
  verificarRol(["admin", "supervisor", "despachador"]),
  pedidoController.registrarFaltantes
);

module.exports = router;
