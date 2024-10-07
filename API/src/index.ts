import express from 'express';
import usuariosRouter from './routes/usuario';
import clasificacionesRouter from './routes/clasificaciones';
import escalasRouter from './routes/escalas';
import operacion_clasificaciones from './routes/operacion_clasificaciones';
import operacion_periodicidades from './routes/operacion_periodicidades';
import operacion_unidades from './routes/operacion_unidades';
import operacion_variable from './routes/operacion_variables';
import operacion from './routes/operacion';
import periodicidades from './routes/periodicidades';
import publicaciones from './routes/publicaciones';
import series from './routes/series';
import tablas from './routes/tablas';
import unidades from './routes/unidades';
import valores from './routes/valores';
import variable from './routes/variable';
import variables_series from './routes/variables_series';
import rateLimit from 'express-rate-limit'; // Importa express-rate-limit

const app = express();
const cors = require('cors'); // Importa el middleware cors

// Configuración de la limitación de tasa de solicitudes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar cada IP a 100 solicitudes por ventana de 15 minutos
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo después de un tiempo.',
  headers: true, // Agrega cabeceras de información sobre el límite
});

//middlewares que transforma la req.body en json
app.use(express.json()); 
app.use(cors({
  origin: 'http://localhost:8081' // Reemplaza con la URL de tu aplicación Ionic
}));

// Aplicar el limitador a todas las rutas
app.use(limiter);

//definimos el puerto
const PORT = 3000;

app.get('/ping', (req, res) => {
  res.send('Hello World');
});

// Rutas de la aplicación
app.use(usuariosRouter);
app.use(clasificacionesRouter);
app.use(escalasRouter);
app.use(operacion_clasificaciones);
app.use(operacion_periodicidades);
app.use(operacion_unidades);
app.use(operacion_variable);
app.use(operacion);
app.use(periodicidades);
app.use(publicaciones);
app.use(series);
app.use(tablas);
app.use(unidades);
app.use(valores);
app.use(variable);
app.use(variables_series);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
