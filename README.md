# 🎉 Backend - Sistema de Gestión de Pedidos y Eventos

Este proyecto es un backend completo construido con **Node.js**, **Express** y **MongoDB** que permite la gestión de eventos (como pedidos de productos), inventario y usuarios con diferentes roles y autenticación basada en JWT.

---

## 🚀 Tecnologías usadas

- Node.js
- Express
- MongoDB con Mongoose
- JSON Web Tokens (JWT) para autenticación
- Dotenv para variables de entorno
- Multer (para subida de imágenes de productos)
- CORS

---

## 👥 Roles soportados

- `admin`: gestión total (usuarios, productos, eventos)
- `recepcionista`: crea pedidos
- `supervisor`: organiza pedidos y productos
- `despachador`: entrega pedidos y gestiona recogida

---

## 📦 Instalación

1. Asegúrate de tener **MongoDB** instalado y corriendo localmente.
2. Clona este repositorio y navega a la carpeta del backend.
3. Instala las dependencias:

```bash
npm install
```

### 📄 Variables de entorno

Este proyecto incluye un archivo de ejemplo llamado `.env.example`.

🔧 **Pasos:**

1. Duplica el archivo `.env.example`
2. Renómbralo como `.env`
3. Ajusta los valores si es necesario:

### Ejecuta el servidor:

```bash
npx nodemon server.js
npm start
```

---

## 🧑‍💼 Crear un usuario administrador

Este sistema incluye un script para crear un usuario `admin` desde la terminal.

### Ejecutar script

```bash
node creaAdmin.js
```

Este script:

- Elimina un admin antiguo (`admin@ejemplo.com`)
- Crea un nuevo usuario con:

```
Email: adminnuevo@ejemplo.com
Contraseña: admin1234
Rol: admin
```

📁 El script está en el archivo `creaAdmin.js` (ajusta la ruta del modelo si lo mueves de carpeta).

---

## 📁 Estructura del proyecto

```
backend-eventos/
├── controllers/     # Lógica de los endpoints
├── middlewares/     # Validación de JWT y roles
├── models/          # Esquemas de Mongoose: Usuario, Evento, Producto
├── routes/          # Rutas organizadas por entidad
├── uploads/         # Imágenes subidas (productos)
├── creaAdmin.js     # Script para crear/eliminar usuario admin
├── .env             # Variables de entorno (ignorado por Git)
├── .env.example     # Plantilla de configuración
├── server.js        # Archivo principal del servidor
├── README.md        # Este archivo
```

---

## 🔐 Autenticación

El login devuelve un token JWT y datos del usuario:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6852cd883f514f4d1fcb1c2e",
    "nombre": "Admin Nuevo",
    "email": "adminnuevo@ejemplo.com",
    "rol": "admin"
  }
}
```

---

## 📂 Endpoints principales

- `POST /api/auth/login` – Iniciar sesión
- `POST /api/productos` – Crear producto
- `GET /api/productos` – Listar productos
- `POST /api/eventos/crear` – Crear evento (pedido)
- `GET /api/eventos/listar` – Listar eventos
- `PUT /api/eventos/actualizar/:id` – Actualizar estado de evento

> 🔐 Las rutas están protegidas según el rol. Requieren cabecera:
> `Authorization: Bearer <token>`

---

## ✅ Verifica que funciona

```
http://localhost:5050/
```

## 🛠 Funcionalidades en desarrollo

- Gestión de productos recogidos por el despachador
- Visualización de eventos en calendario
- Interfaz de frontend con React
