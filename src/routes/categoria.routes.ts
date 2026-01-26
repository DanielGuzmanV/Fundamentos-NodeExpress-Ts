import { Router } from "express";
import { obtenerCategorias, crearCategoria } from "../controllers/categoria.controller.js";

const router = Router();

// Endpoint para obtener todas las categorias
router.get('/', obtenerCategorias);

// Endpoint para crear una nueva categoria
router.post('/', crearCategoria);

export default router;