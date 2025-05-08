const jwt = require("jsonwebtoken");

const verificarAdmin = (req, res, next) => {
  console.log("Usuario autenticado: ", req.user);
  if (req.user.type != "admin") {
    return res
      .status(403)
      .json({
        mensaje: "Acceso denegado. Se requiere el rol de administrador",
      });
  }
  next();
};

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // obtener el token desde el header

  if (!token) {
    return res.status(401).json({ mensaje: "No hay token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // guardar el usuario decodificado en el request
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido o expirado" });
  }
};

module.exports = { verificarAdmin, verificarToken };
