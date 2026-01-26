import express, { type Request, type Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Importacion de rutas:
import categoriaRoutes from './routes/categoria.routes.js'
import productosRoutes from './routes/producto.routes.js';

// Importacion de middlewares:
import { logger, jsonSyntaxError, validarContenido } from './middlewares/app.middlewares.js';
import { errorHandler } from './middlewares/error.handler.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Uso de los middlewares
app.use(logger);
app.use(jsonSyntaxError);
app.use(validarContenido);

// Registro de todas las rutas
app.use('/categorias', categoriaRoutes);
app.use('/productos', productosRoutes)

// ==================================================
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor con Typescript esta funcionando');
});

// Middleware para rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    mensaje: `La direccion ${req.originalUrl} no existe en este servidor`,
    sugerencia: "Verificar el metodo (GET/POST) y la ortografia de la URL"
  })
})

// Middleware de manejo de errores global
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})