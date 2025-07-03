const cors = require('cors');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('dbDokii.json');
const middlewares = jsonServer.defaults();

// Configuración de CORS para aceptar cualquier origen
const corsOptions = {
  origin: '*', // Permite solicitudes desde cualquier origen. Cambia a 'http://localhost:8100' si solo deseas permitir tu frontend.
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
};
server.use(cors(corsOptions));

// Middlewares predeterminados
server.use(middlewares);

// Middleware para el cuerpo de las solicitudes
server.use(jsonServer.bodyParser);

// Ruta personalizada de login
server.post('/login', (req, res) => {
  const users = router.db.get('usuario').value();
  const { email, clave } = req.body;

  const user = users.find((u) => u.email === email && u.clave === clave);

  if (user) {
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: { id: user.id, nombre: user.nombre, rol: user.rol }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Correo o contraseña incorrectos'
    });
  }
});

// Ruta para borrar todos los usuarios
server.delete('/delete/usuarios', (req, res) => {
  const db = router.db;
  db.set('usuario', []).write(); // borra todos los usuarios
  res.status(200).json({ message: 'Todos los usuarios eliminados' });
});

// Ruta para borrar todos los productos
server.delete('/delete/productos', (req, res) => {
  const db = router.db;
  db.set('producto', []).write();
  res.status(200).json({ message: 'Todos los productos eliminados' });
});
  
  // Ruta para borrar todos los pedidos
server.delete('/delete/pedidos', (req, res) => {
  const db = router.db;
  db.set('pedidos', []).write();
  res.status(200).json({ message: 'Todos los pedidos eliminados' });
});
  
  // Ruta para borrar todas las boletas
server.delete('/delete/boletas', (req, res) => {
  const db = router.db;
  db.set('boletas', []).write();
  res.status(200).json({ message: 'Todas las boletas eliminadas' });
});

// Otras rutas
server.use(router);


// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
