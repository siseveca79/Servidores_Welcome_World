const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Ruta para crear un archivo
app.get('/crear', (req, res) => {
  const nombreArchivo = req.query.archivo;
  const contenidoArchivo = req.query.contenido;

  const fechaActual = new Date();
  const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;

  const contenidoCompleto = `${fechaFormateada}\n${contenidoArchivo}`;

  try {
    fs.writeFileSync(`public/archivos/${nombreArchivo}`, contenidoCompleto);
    res.send('Archivo creado exitosamente');
  } catch (error) {
    console.error(error);
    res.send('Error al crear el archivo');
  }
});

// Ruta para leer un archivo
app.get('/leer', (req, res) => {
  const nombreArchivo = req.query.archivo;

  try {
    const contenidoArchivo = fs.readFileSync(`public/archivos/${nombreArchivo}`, 'utf8');
    res.send(contenidoArchivo);
  } catch (error) {
    console.error(error);
    res.send('Error al leer el archivo');
  }
});

// Ruta para renombrar un archivo
app.get('/renombrar', (req, res) => {
  const nombreActual = req.query.nombre;
  const nuevoNombre = req.query.nuevoNombre;

  try {
    fs.renameSync(`public/archivos/${nombreActual}`, `public/archivos/${nuevoNombre}`);
    res.send(`Archivo renombrado exitosamente: ${nombreActual} -> ${nuevoNombre}`);
  } catch (error) {
    console.error(error);
    res.send('Error al renombrar el archivo');
  }
});

// Ruta para eliminar un archivo
app.get('/eliminar', (req, res) => {
  const nombreArchivo = req.query.archivo;

  try {
    fs.unlinkSync(`public/archivos/${nombreArchivo}`);
    res.send(`Archivo eliminado exitosamente: ${nombreArchivo}`);
  } catch (error) {
    console.error(error);
    res.send('Error al eliminar el archivo');
  }
});

// Ruta raíz (/)
app.get('/', (req, res) => {
    const links = [
      { path: '/crear', label: 'Crear archivo' },
      { path: '/leer', label: 'Leer archivo' },
      { path: '/renombrar', label: 'Renombrar archivo' },
      { path: '/eliminar', label: 'Eliminar archivo' },
    ];
  
    const htmlResponse = `
      <h1>Bienvenido al servidor de archivos</h1>
      <ul>
        ${links.map((link) => `
          <li><a href="${link.path}">${link.label}</a></li>
        `).join('')}
      </ul>
    `;
  
    res.send(htmlResponse);
  });
  



app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
