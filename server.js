const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('dbDokii.json');
const middlewares = jsonServer.defaults();

// Agrega middlewares predeterminados (logs, etc.)
server.use(middlewares);

// Middleware para permitir la lectura de datos desde el cuerpo de las solicitudes
server.use(jsonServer.bodyParser);

// Ruta personalizada para login
server.post('/login', (req, res) => {
  const users = router.db.get('usuario').value(); // Obtiene los usuarios del JSON
  const { email, clave } = req.body; // Lee el email y clave del cuerpo de la solicitud

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

// Otras rutas de JSON Server
server.use(router);

// Inicia el servidor en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server está corriendo en http://localhost:${PORT}`);
});


server.put('/usuario/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Filtra solo los campos que deben actualizarse
  const allowedFields = ['nombre', 'apellido', 'email'];
  const sanitizedData = {};

  allowedFields.forEach((field) => {
    if (updatedData[field]) {
      sanitizedData[field] = updatedData[field];
    }
  });

  const user = router.db.get('usuario').find({ id }).assign(sanitizedData).write();

  if (user) {
    res.status(200).json({ success: true, message: 'Usuario actualizado', user });
  } else {
    res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
});


server.use((req, res, next) => {
  if (req.url === '/') {
    return res.redirect('/usuario'); // Redirige a la ruta principal de la base de datos
  }
  next();
});
