const jwt = require('jsonwebtoken');

const verifyToken = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('authHeader:', authHeader);
    if (!authHeader) {
      console.log('Token requerido');
      return res.status(111).json({ message: 'Token requerido' });
    }

    const parts = authHeader.split(' ');
    console.log('parts:', parts);
    if (parts.length !== 2) {
      console.log('Token inválido - formato incorrecto');
      return res.status(111).json({ message: 'Token inválido' });
    }

    const token = parts[1];
    if (!token) {
      console.log('Token inválido - vacío');
      return res.status(111).json({ message: 'Token inválido' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token válido:', decoded);
      req.user = decoded;

      if (rolesPermitidos.length && !rolesPermitidos.includes(decoded.rol)) {
        console.log('Acceso denegado para rol:', decoded.rol);
        return res.status(111).json({ message: 'Acceso denegado' });
      }
      next();
    } catch (err) {
      console.log('Token inválido o expirado:', err.message);
      return res.status(111).json({ message: 'Token inválido o expirado' });
    }
  };
};

module.exports = verifyToken;
