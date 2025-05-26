# Backend - Sistema de Eventos Sociales

Este proyecto es un backend básico en Node.js con Express y MongoDB para la gestión de eventos sociales, incluyendo subida de imágenes, usuarios, roles y más.

## 🚀 Tecnologías usadas

- Node.js
- Express
- MongoDB con Mongoose
- Dotenv para variables de entorno
- Multer (para manejar imágenes)
- CORS

## 📦 Instalación

1. Asegúrate de tener MongoDB instalado y corriendo localmente.
2. Abre una terminal en la raíz del proyecto y ejecuta:

```bash
npm install
````

3. Crea un archivo `.env` en la raíz del proyecto con este contenido:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventosdb
JWT_SECRET=supersecreto123
```

4. Inicia el servidor:

```bash
npx nodemon server.js
```

## 📂 Estructura del proyecto

```
backend-eventos/
├── controllers/     # Lógica de los endpoints
├── models/          # Esquemas de Mongoose
├── routes/          # Rutas de la API
├── uploads/         # Carpeta para imágenes subidas
├── .env             # Variables de entorno
├── server.js        # Archivo principal del servidor
├── README.md        # Este archivo
```

## ✅ Verifica el funcionamiento

Puedes probar si el servidor funciona accediendo a:

```
http://localhost:5000/
```

Deberías ver: `API de eventos funcionando`

## 🛠 Próximos pasos

* Crear modelos de usuario, evento e imagen
* Autenticación con JWT
* CRUD de eventos
* Subida y visualización de imágenes