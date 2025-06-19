const express = require('express');
const router = express.Router();
const Evento = require('../models/Evento');
const Producto = require('../models/Producto');
const verifyToken = require('../middlewares/verifyToken');

// Crear evento/pedido (admin y recepcionista)
router.post('/crear', verifyToken(['admin', 'recepcionista']), async (req, res) => {
  try {
    const eventoData = req.body;

    // Validar que productos existan y obtener datos necesarios
    const productosValidos = [];
    for (const p of eventoData.productos) {
      const productoDB = await Producto.findById(p.productoId);
      if (!productoDB) return res.status(400).json({ error: `Producto no encontrado: ${p.productoId}` });

      productosValidos.push({
        productoId: productoDB._id,
        nombre: productoDB.nombre,
        cantidad: p.cantidad,
        precioUnitario: productoDB.precioUnitario
      });
    }
    eventoData.productos = productosValidos;

    const evento = new Evento(eventoData);
    await evento.save();
    res.status(201).json(evento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar eventos con roles permitidos
router.get('/listar', verifyToken(['admin', 'recepcionista', 'supervisor', 'despachador']), async (req, res) => {
  try {
    const eventos = await Evento.find().populate('recepcionistaId supervisorId despachadorId');
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado, roles y productos recogidos (admin y supervisor)
router.put('/actualizar/:id', verifyToken(['admin', 'supervisor']), async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });

    const { estado, recepcionistaId, supervisorId, despachadorId, productosRecogidos, observaciones } = req.body;

    if (estado) evento.estado = estado;
    if (recepcionistaId) evento.recepcionistaId = recepcionistaId;
    if (supervisorId) evento.supervisorId = supervisorId;
    if (despachadorId) evento.despachadorId = despachadorId;
    if (productosRecogidos) evento.productosRecogidos = productosRecogidos;
    if (observaciones !== undefined) evento.observaciones = observaciones;

    await evento.save();
    res.json(evento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
