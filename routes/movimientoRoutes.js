const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/verificarToken");
const movimientoController = require("../controllers/movimientoController");

// Registrar movimiento (entrada o salida)
router.post(
  "/",
  verificarToken(["admin", "recepcionista", "supervisor"]),
  movimientoController.registrarMovimiento
);

// Consultar movimientos de un producto
router.get(
  "/producto/:productoId",
  verificarToken(["admin", "recepcionista", "supervisor"]),
  movimientoController.obtenerMovimientosPorProducto
);

module.exports = router;
