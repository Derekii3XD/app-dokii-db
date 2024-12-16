const cors = require('cors');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('dbDokii.json');
const middlewares = jsonServer.defaults();

// Configuración de CORS para aceptar cualquier origen
server.use(cors({
  origin: '*', // Permitir cualquier origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Otras rutas
server.use(router);

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
