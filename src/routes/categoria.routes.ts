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
/**
 * @openapi
 * /categorias/{id}:
 *   get:
 *     tags:
 *       - Categorías
 *     summary: Obtener una categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría a consultar
 *     responses:
 *       200:
 *         description: Categoría encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Electrónica"
 *                 activo:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: La categoría especificada no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "La categoría no existe."
 */
router.get('/:id', obtenerUnaCat);

// Endpoint para crear una nueva categoria
/**
 * @openapi
 * /categorias:
 *   post:
 *     tags:
 *       - Categorías
 *     summary: Crear una nueva categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Hogar y Cocina"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 nombre:
 *                   type: string
 *                   example: "Hogar y Cocina"
 *                 activo:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Datos de entrada no válidos o el nombre ya existe
 */
router.post('/', crearCategoria);

// Endpoint para actualizar el nombre de una categoria
/**
 * @openapi
 * /categorias/{id}:
 *   put:
 *     tags:
 *       - Categorías
 *     summary: Actualizar el nombre de una categoría
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Electrónica y Tecnología"
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       400:
 *         description: ID de categoría no válido o el nombre ya pertenece a otra categoría
 *       404:
 *         description: La categoría no existe o está deshabilitada
 */
router.put('/:id', actualizarCategoria);

// Endpoint para ocultar una categoria
/**
 * @openapi
 * /categorias/{id}:
 *   patch:
 *     tags:
 *       - Categorías
 *     summary: Ocultar una categoría (Desactivar)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a desactivar
 *     responses:
 *       200:
 *         description: Categoría ocultada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 activo:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: La categoría no existe
 */
router.patch('/:id', ocultarCategoria);

// Endpoint para mostrar una categoria oculta
/**
 * @openapi
 * /categorias/{id}/restore:
 *   patch:
 *     tags:
 *       - Categorías
 *     summary: Mostrar o reactivar una categoría ocultada
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a restaurar
 *     responses:
 *       200:
 *         description: Categoría reactivada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 activo:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: La categoría no fue encontrada
 */
router.patch('/:id/restore', mostrarCategoria);

// Endpoint para eliminar una categoria
/**
 * @openapi
 * /categorias/{id}:
 *   delete:
 *     tags:
 *       - Categorías
 *     summary: Eliminar una categoría permanentemente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a eliminar
 *     responses:
 *       200:
 *         description: Categoría eliminada permanentemente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoría eliminada con éxito."
 *       404:
 *         description: La categoría especificada no existe
 */
router.delete('/:id', eliminarCategoria);

export default router;