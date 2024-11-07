const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para la página votacion
app.get('/votacion', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'votacion.html'));
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
// Ruta para el juego de speaking
app.get('/speaking', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'speaking.html'));
});

// Ruta para el juego de lateralidad
app.get('/lateralidad', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lateralidad.html'));
});