const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email ya registrado' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({ nombre, email, passwordHash, rol });
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ message: 'Email o contraseña incorrectos' });

    const isMatch = await bcrypt.compare(password, usuario.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Email o contraseña incorrectos' });

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
