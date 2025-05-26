const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // multer para imágenes
const {
  crearEvento,
  listarEventos,
  actualizarEvento,
  eliminarEvento,
  subirImagenes
} = require('../controllers/eventoController');

// Crear evento con subida de imágenes (máximo 5)
router.post('/crear', upload.array('imagenes', 5), crearEvento);

// Listar todos los eventos
router.get('/listar', listarEventos);

// Actualizar evento por ID (sin imágenes)
router.put('/actualizar/:id', actualizarEvento);

// Eliminar evento por ID
router.delete('/eliminar/:id', eliminarEvento);

// Subir imágenes adicionales a evento existente
router.post('/:id/imagenes', upload.array('imagenes', 5), subirImagenes);

module.exports = router;
