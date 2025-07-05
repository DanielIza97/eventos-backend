const express = require("express");
const router = express.Router();
const Evento = require("../models/Evento");
const Producto = require("../models/Producto");
const { verificarToken } = require("../middlewares/verificarToken");

// Crear evento/pedido (admin y recepcionista)
router.post(
  "/crear",
  verificarToken(["admin", "recepcionista"]),
  async (req, res) => {
    try {
      const eventoData = req.body;

      // Validar que productos exista y sea arreglo no vacío
      if (
        !eventoData.productos ||
        !Array.isArray(eventoData.productos) ||
        eventoData.productos.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Debe enviar al menos un producto para el pedido" });
      }

      // Obtener todos los IDs para una sola búsqueda
      const productoIds = eventoData.productos.map((p) => p.productoId);

      const productosDB = await Producto.find({ _id: { $in: productoIds } });

      if (productosDB.length !== productoIds.length) {
        // Encontrar cuáles no existen
        const productosDBIds = productosDB.map((p) => p._id.toString());
        const productosNoEncontrados = productoIds.filter(
          (id) => !productosDBIds.includes(id)
        );
        return res.status(400).json({
          error: `Producto(s) no encontrado(s): ${productosNoEncontrados.join(
            ", "
          )}`,
        });
      }

      // Construir arreglo productos válidos con datos frescos
      const productosValidos = eventoData.productos.map((p) => {
        const productoDB = productosDB.find(
          (prod) => prod._id.toString() === p.productoId
        );
        return {
          productoId: productoDB._id,
          nombre: productoDB.nombre,
          cantidad: p.cantidad,
          precioUnitario: productoDB.precioUnitario,
        };
      });

      eventoData.productos = productosValidos;

      const evento = new Evento(eventoData);
      await evento.save();
      res.status(201).json(evento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Listar eventos con roles permitidos
router.get(
  "/listar",
  verificarToken(["admin", "recepcionista", "supervisor", "despachador"]),
  async (req, res) => {
    try {
      const eventos = await Evento.find().populate(
        "recepcionistaId supervisorId despachadorId"
      );
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Actualizar estado, roles, productos y otros campos (admin y supervisor)
router.put(
  "/actualizar/:id",
  verificarToken(["admin", "supervisor"]),
  async (req, res) => {
    try {
      const evento = await Evento.findById(req.params.id);
      if (!evento)
        return res.status(404).json({ error: "Evento no encontrado" });

      const {
        estado,
        recepcionistaId,
        supervisorId,
        despachadorId,
        productosRecogidos,
        observaciones,
        nombreCliente,
        fechaEvento,
        lugar,
      } = req.body;

      if (nombreCliente !== undefined) evento.nombreCliente = nombreCliente;

      if (fechaEvento !== undefined) {
        const fecha = new Date(fechaEvento);
        if (isNaN(fecha.getTime())) {
          return res.status(400).json({ error: "Fecha inválida" });
        }
        evento.fechaEvento = fecha;
      }

      if (lugar !== undefined) evento.lugar = lugar;
      if (estado !== undefined) evento.estado = estado;
      if (recepcionistaId !== undefined)
        evento.recepcionistaId = recepcionistaId;
      if (supervisorId !== undefined) evento.supervisorId = supervisorId;
      if (despachadorId !== undefined) evento.despachadorId = despachadorId;
      if (productosRecogidos !== undefined)
        evento.productosRecogidos = productosRecogidos;
      if (observaciones !== undefined) evento.observaciones = observaciones;

      await evento.save();

      res.json(evento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Obtener evento por ID (para editar)
router.get(
  "/:id",
  verificarToken(["admin", "recepcionista", "supervisor", "despachador"]),
  async (req, res) => {
    try {
      const evento = await Evento.findById(req.params.id).populate(
        "recepcionistaId supervisorId despachadorId"
      );
      if (!evento)
        return res.status(404).json({ error: "Evento no encontrado" });

      res.json(evento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
