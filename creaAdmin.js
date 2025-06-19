// creaAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Usuario = require('./models/Usuario'); // Ajusta ruta si es necesario

async function crearYEliminar() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventosdb');
    console.log('Mongo conectado');

    // Eliminar usuario viejo
    const emailViejo = 'admin@ejemplo.com';
    await Usuario.deleteOne({ email: emailViejo });
    console.log(`Usuario con email ${emailViejo} eliminado`);

    // Crear nuevo admin
    const nuevoUsuario = {
      nombre: 'Admin Nuevo',
      email: 'adminnuevo@ejemplo.com',
      rol: 'admin',
      password: 'admin1234', // Contraseña clara para generar hash
    };

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(nuevoUsuario.password, salt);

    const usuario = new Usuario({
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
      passwordHash,
    });

    await usuario.save();
    console.log(`Usuario admin creado con email ${nuevoUsuario.email} y contraseña ${nuevoUsuario.password}`);

    mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

crearYEliminar();
