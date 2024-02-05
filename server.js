const express = require('express');

const { Client } = require('pg');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Configura el middleware para analizar las solicitudes JSON



app.use(cors());

// Configura la conexión a PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'PRODUCTOS',
  password: '1234',
  port: 5432,
});

client.connect()
  .then(() => console.log('Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('Error al conectar a PostgreSQL', err));

// Ruta para manejar la solicitud de envío de productos desde el formulario HTML
app.post('/enviarProducto', (req, res) => {
  console.log('Cuerpo de la solicitud:', req.body);

  const { nombre, tipo, fechaCaducidad, cantidad, precio } = req.body;

 
// Inserta el producto en la base de datos
const query = 'INSERT INTO panaderia(nombre_producto, tipo, fecha_caducidad, cantidad, precio) VALUES($1, $2, $3, $4, $5)';
const values = [nombre, tipo, fechaCaducidad, cantidad, precio];
  client.query(query, values)
    .then(() => res.status(200).send({ message: 'Producto enviado correctamente' }))
    .catch(err => {
      console.error('Error al enviar el producto:', err);
      res.status(500).send(`Error interno del servidor: ${err.message}`);
    });
});

//Consulta de registros
app.get('/verInventario', (req, res) => {
  const query = 'SELECT id, nombre_producto, fecha_caducidad FROM PANADERIA';

  client.query(query)
    .then(data => {
      res.status(200).json({ productos: data.rows });
    })
    .catch(err => {
      console.error('Error al obtener el inventario:', err);
      res.status(500).send('Error interno del servidor');
    });
});


// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

