const Evento = require("../models/Evento");

exports.crearEvento = async (req, res) => {
  try {
    const {
      clienteId,
      nombre,
      tipoEvento,
      fecha,
      horaInicio,
      horaFin,
      lugar,
      estado,
      servicios,
      total,
      pagado,
      saldo,
      organizadorId,
      observaciones,
    } = req.body;

    const imagenes = req.files ? req.files.map((file) => file.path) : [];

    const nuevoEvento = new Evento({
      clienteId,
      nombre,
      tipoEvento,
      fecha,
      horaInicio,
      horaFin,
      lugar,
      estado,
      servicios: servicios ? JSON.parse(servicios) : [],
      imagenes,
      total,
      pagado,
      saldo,
      organizadorId,
      observaciones,
    });

    await nuevoEvento.save();
    res.status(201).json({ msg: "Evento creado", evento: nuevoEvento });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al crear evento", error: error.message });
  }
};

exports.listarEventos = async (req, res) => {
  try {
    const eventos = await Evento.find()
      .populate("clienteId", "nombre telefono correo")
      .populate("organizadorId", "nombre email rol")
      .exec();
    res.json(eventos);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener eventos", error: error.message });
  }
};

exports.actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.servicios && typeof updateData.servicios === "string") {
      updateData.servicios = JSON.parse(updateData.servicios);
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!eventoActualizado)
      return res.status(404).json({ msg: "Evento no encontrado" });

    res.json({ msg: "Evento actualizado", evento: eventoActualizado });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al actualizar evento", error: error.message });
  }
};

exports.eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const eventoEliminado = await Evento.findByIdAndDelete(id);
    if (!eventoEliminado)
      return res.status(404).json({ msg: "Evento no encontrado" });

    res.json({ msg: "Evento eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al eliminar evento", error: error.message });
  }
};

exports.subirImagenes = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findById(id);
    if (!evento) return res.status(404).json({ msg: "Evento no encontrado" });

    const imagenesSubidas = req.files.map((file) => file.path);
    evento.imagenes = evento.imagenes.concat(imagenesSubidas);

    await evento.save();
    res.json({
      msg: "Imágenes subidas correctamente",
      imagenes: evento.imagenes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al subir imágenes", error: error.message });
  }
};
