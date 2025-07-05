const jwt = require("jsonwebtoken");

// Middleware para verificar token y roles
const verificarToken = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const token = parts[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (rolesPermitidos.length && !rolesPermitidos.includes(decoded.rol)) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};

// Middleware para verificar solo rol (suponiendo que req.user ya existe)
const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: "Acceso denegado para su rol" });
    }
    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol,
};
