import { Router } from "express";
import { 
  obtenerProductos, 
  crearProducto,
  productoID,
} from "../controllers/producto.controller.js";
import validarProducto from "../middlewares/producto.validator.js";

const router = Router();

// GET /productos = obtener todos los productos
router.get('/', obtenerProductos);

// GET /productos/:id = obtener un producto por su ID
router.get('/:id', productoID)

// POST /productos = guardar un nuevo producto
router.post('/', validarProducto, crearProducto);

export default router;