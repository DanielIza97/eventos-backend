const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Genera la ruta de destino con estructura por fecha
const getUploadPath = () => {
  const now = new Date();
  const folderPath = path.join(
    "uploads",
    String(now.getFullYear()),
    String(now.getMonth() + 1),
    String(now.getDate())
  );
  fs.mkdirSync(folderPath, { recursive: true });
  return folderPath;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = getUploadPath();
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = uniqueSuffix + ext;

    // Guardar la ruta relativa (para MongoDB)
    const now = new Date();
    const relativePath = path.join(
      "uploads",
      String(now.getFullYear()),
      String(now.getMonth() + 1),
      String(now.getDate()),
      filename
    );

    // Guardar esta ruta en req para usarla luego
    if (!req.savedFiles) req.savedFiles = [];
    req.savedFiles.push(relativePath);

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif, webp)"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
