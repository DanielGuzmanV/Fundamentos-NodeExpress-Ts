import { Router } from "express";
import { 
  obtenerProductos, 
  crearProducto,
  productoID,
} from "../controllers/producto.controller.js";
import validarProducto from "../middlewares/producto.validator.js";

const router = Router();

// GET /productos = obtener todos los productos, incluyendo el precio minimo o nombre
// Formas de llamarlo: 
// /productos?min_precio=50
// /productos?nombre=Teclado
// /productos?orden=caro, barato o nombre
// /productos?pagina=1
// /productos?limite=5
// /productos?nombre=A&min_precio=10&orden=barato&limite=10
router.get('/', obtenerProductos);

// GET /productos/:id = obtener un producto por su ID
router.get('/:id', productoID)

// POST /productos = guardar un nuevo producto
router.post('/', validarProducto, crearProducto);

export default router;