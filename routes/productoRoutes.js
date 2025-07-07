const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/verificarToken");
const upload = require("../middlewares/uploadMiddleware");
const productoController = require("../controllers/productoController");

// Crear producto (solo admin)
router.post(
  "/",
  verificarToken(["admin"]),
  upload.array("imagenes", 5),
  productoController.crearProducto
);

// Listar productos (roles permitidos)
router.get(
  "/",
  verificarToken(["admin", "recepcionista", "supervisor", "despachador"]),
  productoController.listarProductos
);

// Obtener producto por ID
router.get(
  "/:id",
  verificarToken(["admin", "recepcionista", "supervisor", "despachador"]),
  productoController.obtenerProductoPorId
);

// Actualizar producto (solo admin)
router.put(
  "/:id",
  verificarToken(["admin"]),
  upload.array("imagenes", 5),
  productoController.actualizarProducto
);

// Eliminar producto (solo admin)
router.delete(
  "/:id",
  verificarToken(["admin"]),
  productoController.eliminarProducto
);

module.exports = router;
