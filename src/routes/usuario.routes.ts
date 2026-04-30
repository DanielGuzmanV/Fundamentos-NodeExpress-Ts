import { Router } from "express";
import { loginUser, obtenerUsuarioId, obtenerUsuarios, registrarUser } from "../controllers/usuario.controller.js";

const router = Router();

// Rutas:
// GET: /auth/usuarios = Obtener todos los usuarios
router.get('/', obtenerUsuarios);

// GET: /auth/:id = obtener un usuario por ID
router.get('/:id', obtenerUsuarioId);

// POST: /auth/registrar = Registrar un nuevo usuario
router.post('/registrar', registrarUser);

// POST: /auth/login = Iniciar sesion
router.post('/login', loginUser);

export default router;