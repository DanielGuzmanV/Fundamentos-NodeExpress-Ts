import { Router } from "express";
import { 
  obtenerCategorias, 
  crearCategoria, 
  actualizarCategoria, 
  ocultarCategoria, 
  mostrarCategoria,
  eliminarCategoria,
  vaciarTablaCat,
  obtenerUnaCat
} from "../controllers/categoria.controller.js";

const router: Router = Router();

// Endpoint para vaciar toda la tabla de categoria
router.delete('/delete', vaciarTablaCat);

// Endpoint para obtener todas las categorias
/**
 * @openapi
 * /categorias:
 *   get:
 *     tags:
 *       - Categorías
 *     summary: Obtener todas las categorías activas
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Electrónica"
 *                   activo:
 *                     type: integer
 *                     example: 1
 */
router.get('/', obtenerCategorias);

// Endpoint para obtener una categoria
router.get('/:id', obtenerUnaCat);

// Endpoint para crear una nueva categoria
router.post('/', crearCategoria);

// Endpoint para actualizar el nombre de una categoria
router.put('/:id', actualizarCategoria);

// Endpoint para ocultar una categoria
router.patch('/:id', ocultarCategoria);

// Endpoint para mostrar una categoria oculta
router.patch('/:id/restore', mostrarCategoria);

// Endpoint para eliminar una categoria
router.delete('/:id', eliminarCategoria);

export default router;