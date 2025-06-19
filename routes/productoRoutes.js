const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const verifyToken = require('../middlewares/verifyToken');

// Crear producto (solo admin)
router.post('/', verifyToken(['admin']), async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar productos (roles permitidos)
router.get('/', verifyToken(['admin', 'recepcionista', 'supervisor', 'despachador']), async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar producto (solo admin)
router.put('/:id', verifyToken(['admin']), async (req, res) => {
  try {
    const updateData = {...req.body, actualizadoEn: Date.now()};
    const producto = await Producto.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar producto (solo admin)
router.delete('/:id', verifyToken(['admin']), async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
