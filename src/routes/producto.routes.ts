import { Router } from "express";
import { 
  obtenerProductos, 
  crearProducto,
  productoID,
  editarProducto,
  actualizarParcial,
  ocultarProducto,
  restaurarProducto,
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

// PUT /productos/:id editar un producto por el ID
router.put('/:id', validarProducto, editarProducto)

// PATCH /productos/:id editar parcialmente un producto
router.patch('/:id', actualizarParcial)

// DELETE /productos/:id ocultar un producto por el id
router.delete('/:id', ocultarProducto)

// PATCH /productos/:id mostrar un producto ocultado por el id
router.patch('/restore/:id', restaurarProducto);

export default router;