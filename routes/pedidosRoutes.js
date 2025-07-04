const express = require("express");
const router = express.Router();

const pedidosController = require("../controllers/pedidosController");
const {
  verificarToken,
  verificarRol,
} = require("../middlewares/authMiddleware");

// Crear un pedido asociado a un evento
router.post("/evento/:id", verificarToken, pedidosController.crearPedido);

// Obtener todos los pedidos de un evento
router.get(
  "/evento/:id",
  verificarToken,
  pedidosController.obtenerPedidosPorEvento
);

// Registrar faltantes en un pedido (solo roles autorizados)
router.put(
  "/faltantes/:pedidoId",
  verificarToken,
  verificarRol(["admin", "supervisor", "despachador"]),
  pedidosController.registrarFaltantes
);

module.exports = router;
