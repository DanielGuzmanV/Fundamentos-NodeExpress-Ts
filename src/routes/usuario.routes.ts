import { Router } from "express";
import { 
  actualizarPassword,
  editarParcial,
  editarUsuario, 
  eliminarUsuario, 
  loginUser, 
  mostrarUsuario, 
  obtenerUsuarioId, 
  obtenerUsuarios, 
  ocultarUsuario, 
  registrarUser 
} from "../controllers/usuario.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/rol.middleware.js";

const router = Router();

// Rutas:
// GET: /auth/usuarios = Solo el adming puede obtener todos los usuarios
router.get('/', authenticateToken, authorizeRole('admin'), obtenerUsuarios);

// GET: /auth/:id = obtener un usuario por ID
router.get('/:id', authenticateToken, obtenerUsuarioId);

// POST: /auth/registrar = Registrar un nuevo usuario
router.post('/registrar', registrarUser);

// POST: /auth/login = Iniciar sesion
router.post('/login', loginUser);

// PUT: /auth/:id = Editar un usuario si esta logeado
router.put('/:id', authenticateToken, editarUsuario);

// PATCH: /auth/:id = Actualizacion parcial de datos
router.patch('/:id', authenticateToken, editarParcial)

// PATCH: /auth/:id/password = Actualizar constraseña
router.patch('/:id/password', authenticateToken, actualizarPassword);

// PATCH: /auth/:id/activar = Reactivar un usuario oculto (solo puede el admin)
router.patch("/:id/active", authenticateToken, authorizeRole('admin'), mostrarUsuario)

// DELETE: /auth/:id = Eliminar/ocultar un usuario (soft delete)
router.delete('/:id', authenticateToken, authorizeRole('admin'), ocultarUsuario);

// DELETE /auth/:id = Eliminar usuarios, solo el admin puede realizarlo
router.delete('/:id/delete', authenticateToken, authorizeRole('admin'), eliminarUsuario);


export default router;