const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const { verificarToken } = require("./middlewares/verificarToken");

dotenv.config();

const app = express();

// 🗂️ Directorio de subida de archivos
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // 🛠 Crea subdirectorios si es necesario
}

// 🔧 Middlewares base
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // 📋 Logging de requests
app.use("/uploads", express.static(uploadDir)); // Acceso a archivos estáticos

// 🌐 Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/eventosdb")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conexión Mongo:", err));

// 📥 Middleware global para log personalizado
app.use((req, res, next) => {
  console.log(`📥 Petición recibida: ${req.method} ${req.url}`);
  next();
});

// 📦 Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/productos", require("./routes/productoRoutes"));
app.use(
  "/api/eventos",
  verificarToken(["admin", "recepcionista", "supervisor", "despachador"]),
  require("./routes/eventoRoutes")
);
app.use(
  "/api/pedidos",
  verificarToken(["admin", "recepcionista", "supervisor", "despachador"]),
  require("./routes/pedidoRoutes")
);
app.use(
  "/api/movimientos",
  verificarToken(["admin", "recepcionista", "supervisor"]),
  require("./routes/movimientoRoutes")
);

// 🛠 Ruta de prueba
//app.get("/ping", (req, res) => res.send("pong"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));
