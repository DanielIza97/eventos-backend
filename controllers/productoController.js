const Producto = require("../models/Producto");
const fs = require("fs");
const path = require("path");

exports.crearProducto = async (req, res) => {
  try {
    const imagenes = req.savedFiles || [];

    const producto = new Producto({
      ...req.body,
      imagenes,
      creadoPor: req.user._id,
      actualizadoPor: req.user._id,
    });

    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const productoExistente = await Producto.findById(req.params.id);
    if (!productoExistente)
      return res.status(404).json({ error: "Producto no encontrado" });

    const updateData = {
      ...req.body,
      actualizadoPor: req.user._id,
      actualizadoEn: Date.now(),
    };

    const imagenesParaEliminar = req.body.imagenesParaEliminar
      ? JSON.parse(req.body.imagenesParaEliminar)
      : [];

    let imagenesActualizadas = productoExistente.imagenes.filter(
      (img) => !imagenesParaEliminar.includes(img)
    );

    imagenesParaEliminar.forEach((imgPath) => {
      const rutaImagen = path.join(__dirname, "..", imgPath);
      fs.unlink(rutaImagen, (err) => {
        if (err) console.error("Error al eliminar archivo:", err);
      });
    });

    if (req.savedFiles && req.savedFiles.length > 0) {
      const nuevasImagenes = req.savedFiles;
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
};

exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });

    // Eliminar imágenes asociadas
    producto.imagenes.forEach((imgPath) => {
      const rutaImagen = path.join(__dirname, "..", imgPath);
      fs.unlink(rutaImagen, (err) => {
        if (err) console.error("Error al eliminar imagen:", err);
      });
    });

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
