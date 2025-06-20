const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadMiddleware");
const fs = require("fs");
const path = require("path");

// Crear producto (solo admin)
router.post(
  "/",
  verifyToken(["admin"]),
  upload.array("imagenes", 5), // Máximo 5 imágenes
  async (req, res) => {
    try {
      const imagenes = req.files.map((file) => file.filename);

      const producto = new Producto({
        ...req.body,
        imagenes,
      });

      await producto.save();
      res.status(201).json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Listar productos (roles permitidos)
router.get(
  "/",
  verifyToken(["admin", "recepcionista", "supervisor", "despachador"]),
  async (req, res) => {
    try {
      const productos = await Producto.find();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Actualizar producto (solo admin) con soporte para imágenes
router.put(
  "/:id",
  verifyToken(["admin"]),
  upload.array("imagenes", 5), // imágenes nuevas para añadir
  async (req, res) => {
    try {
      const productoExistente = await Producto.findById(req.params.id);
      if (!productoExistente)
        return res.status(404).json({ error: "Producto no encontrado" });

      const updateData = { ...req.body, actualizadoEn: Date.now() };

      // Obtener las imágenes que el cliente quiere eliminar (si envía)
      const imagenesParaEliminar = req.body.imagenesParaEliminar
        ? JSON.parse(req.body.imagenesParaEliminar)
        : [];

      // Filtrar las imágenes actuales para eliminar las solicitadas
      let imagenesActualizadas = productoExistente.imagenes.filter(
        (img) => !imagenesParaEliminar.includes(img)
      );

      // Eliminar físicamente las imágenes del servidor
      imagenesParaEliminar.forEach((imgNombre) => {
        const rutaImagen = path.join(__dirname, "../uploads", imgNombre);
        fs.unlink(rutaImagen, (err) => {
          if (err) console.error("Error al eliminar archivo:", err);
        });
      });

      // Agregar imágenes nuevas si existen
      if (req.files && req.files.length > 0) {
        const nuevasImagenes = req.files.map((file) => file.filename);
        imagenesActualizadas = imagenesActualizadas.concat(nuevasImagenes);
      }

      updateData.imagenes = imagenesActualizadas;

      const productoActualizado = await Producto.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(productoActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Obtener producto por ID
router.get(
  "/:id",
  verifyToken(["admin", "recepcionista", "supervisor", "despachador"]),
  async (req, res) => {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Eliminar producto (solo admin)
router.delete("/:id", verifyToken(["admin"]), async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
