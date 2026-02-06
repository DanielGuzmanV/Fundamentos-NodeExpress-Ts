import { Router } from "express";
import { 
  obtenerCategorias, 
  crearCategoria, 
  actualizarCategoria, 
  ocultarCategoria, 
  mostrarCategoria,
  eliminarCategoria,
  vaciarTablaCat
} from "../controllers/categoria.controller.js";

const router = Router();

// Endpoint para vaciar toda la tabla de categoria
router.delete('/delete', vaciarTablaCat);

// Endpoint para obtener todas las categorias
router.get('/', obtenerCategorias);

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