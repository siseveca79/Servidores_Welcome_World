const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Función para mostrar mensajes de respuesta
function mostrarRespuesta(res, mensaje) {
  const htmlContent = `
    <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous" />
    </head>

    <div class="row w-75 m-auto">
      <div class="col-12 mt-3">
        
        <a href="/" class="btn btn-primary">Volver a la página principal</a>


        <p>${mensaje}</p>
      </div>
    </div>
  `;

  res.send(htmlContent);
}

// Ruta para crear un archivo
app.post('/crear', (req, res) => {
  const { nombre, extension, contenido } = req.body;

  const fechaActual = new Date();
  const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
  const nombreCompletoArchivo = `${nombre}.${extension}`;
  const contenidoCompleto = `${fechaFormateada}\n${contenido}`;

  try {
    fs.writeFileSync(`public/archivos/${nombreCompletoArchivo}`, contenidoCompleto);
    mostrarRespuesta(res, 'Archivo creado exitosamente');
  } catch (error) {
    console.error(error);
    mostrarRespuesta(res, 'Error al crear el archivo');
  }
});

// Ruta para ver un archivo
app.get('/ver', (req, res) => {
  const { nombre, extension } = req.query;
  const nombreCompletoArchivo = `${nombre}.${extension}`;

  try {
    const contenidoArchivo = fs.readFileSync(`public/archivos/${nombreCompletoArchivo}`, 'utf8');
    res.send(contenidoArchivo);
    mostrarRespuesta(res, 'Archivo leído exitosamente');
  } catch (error) {
    console.error(error);
    mostrarRespuesta(res, 'Error al leer el archivo');
  }
});


// Ruta para editar un archivo
app.post('/editar', (req, res) => {
  const { nombre, extension, nuevoContenido } = req.body;
  const nombreCompletoArchivo = `${nombre}.${extension}`;

  try {
    fs.writeFileSync(`public/archivos/${nombreCompletoArchivo}`, nuevoContenido);
    mostrarRespuesta(res, 'Archivo actualizado exitosamente');
  } catch (error) {
    console.error(error);
    mostrarRespuesta(res, 'Error al guardar el archivo');
  }
});

// Ruta para eliminar un archivo
app.post('/eliminar', (req, res) => {
  const { nombre, extension } = req.body;
  const nombreCompletoArchivo = `${nombre}.${extension}`;

  try {
    fs.unlinkSync(`public/archivos/${nombreCompletoArchivo}`);
    mostrarRespuesta(res, 'Archivo eliminado exitosamente');
  } catch (error) {
    console.error(error);
    mostrarRespuesta(res, 'Error al eliminar el archivo');
  }
});

// Ruta raíz (/)
app.get('/', (req, res) => {
  const htmlContent = `
    <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous" />
    </head>

    <div class="row w-75 m-auto">
      <!-- Crear -->
      <div class="col-12 col-sm-3 contaienr p-5">
        <h3>Crear un archivo</h3>
        <form action="/crear" method="post">
          <div class="form-group">
            Nombre del archivo
            <input name="nombre" class="form-control" id="nombre" />
          </div>
          <div class="form-group">
            Extensión del archivo
            <input name="extension" class="form-control" id="extension" />
          </div>
          <div class="form-group">
            Contenido
            <textarea name="contenido" class="form-control" id="contenido" cols="30" rows="10"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Crear archivo</button>
        </form>
      </div>
      <!-- Leer -->
      <div class="col-12 col-sm-3 contaienr p-5">
        <h3>Leer un archivo</h3>
        <form action="/ver">
          <div class="form-group">
            Nombre del archivo
            <input name="nombre" class="form-control" id="nombre" />
          </div>
          <div class="form-group">
            Extensión del archivo
            <input name="extension" class="form-control" id="extension" />
          </div>
          <button type="submit" class="btn btn-info">Consultar archivo</button>
        </form>
      </div>
      <!-- Editar -->
      <div class="col-12 col-sm-3 contaienr p-5">
        <h3>Editar un archivo</h3>
        <form action="/editar" method="post">
          <div class="form-group">
            Nombre del archivo
            <input name="nombre" class="form-control" id="nombre" />
          </div>
          <div class="form-group">
            Extensión del archivo
            <input name="extension" class="form-control" id="extension" />
          </div>
          <div class="form-group">
            Nuevo contenido
            <textarea name="nuevoContenido" class="form-control" id="nuevoContenido" cols="30" rows="10"></textarea>
          </div>
          <button type="submit" class="btn btn-warning">Editar archivo</button>
        </form>
      </div>
      <!-- Eliminar -->
      <div class="col-12 col-sm-3 contaienr p-5">
        <h3>Eliminar un archivo</h3>
        <form action="/eliminar" method="post">
          <div class="form-group">
            Nombre del archivo
            <input name="nombre" class="form-control" id="nombre" />
          </div>
          <div class="form-group">
            Extensión del archivo
            <input name="extension" class="form-control" id="extension" />
          </div>
          <button type="submit" class="btn btn-danger">Eliminar archivo</button>
        </form>
      </div>
    </div>
  `;

  res.send(htmlContent);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
