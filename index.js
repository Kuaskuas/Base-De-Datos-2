const express = require('express');
require('dotenv').config();
const app = express();
const Controlador = require('./routes/index.routes');
const connectDB = require('./config/database');

// Middlewares
app.use(express.json());

// Rutas
app.use('/api', Controlador);

// Puerto
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos antes de iniciar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}).catch((error) => {
  console.error('No se pudo conectar a MongoDB:', error.message);
});