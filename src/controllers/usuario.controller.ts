import { Request, Response, NextFunction } from "express";
import UsuarioServices from "../services/usuario.service.js";

// Controller para obtener todos los usuarios
export const obtenerUsuarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarios = await UsuarioServices.listarUsuarios();

    res.json({
      mensaje: "Lista de usuarios obtenida correctamente",
      usuarios
    })
  } catch (err: any) {
    next(err);
  }
}

// Controller para obtener un usuario por ID
export const obtenerUsuarioId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const usuario = await UsuarioServices.obtenerUsuarioPorId(id, req.user);

    res.json({
      mensaje: "Usuario encontrado",
      usuario
    })
  } catch (err: any) {
    const errorMap: Record<string, {status: number, msg: string }> = {
      "UNAUTHENTICATED": {status: 401, msg: "No has iniciado sesión"},
      "NOT_FOUND_ID": {status: 400, msg: "El ID proporcionado no es valido"},
      "USER_NOT_FOUND": {status: 404, msg: "Usuario no encontrado"},
      "UNAUTHORIZED_ACCESS": {status: 403, msg: "No tienes permiso para ver este perfil"},
    }

    const errors = errorMap[err.message];

    if(errors) return res.status(errors.status).json({error: errors.msg});
    next(err);
  }
}

// Controller para registrar un nuevo usuario
export const registrarUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {username, password, rol} = req.body;

    const usuarioNuevo = await UsuarioServices.registrarUsuario({
      username, password, rol
    });

    res.status(201).json({
      mensaje: "Usuario registrado con exito",
      usuario: usuarioNuevo
    })
  } catch (err: any) {
    if(err.message == "MISSING_DATA") {
      return res.status(400).json({ error: "Username y password son obligatorios" });
    }

    if(err.message === "USER_ALREADY_EXISTS") {
      return res.status(400).json({ error: "El nombre de usuario ya existe" });
    }

    next(err);
  }
}

// Controller para iniciar sesion:
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {username, password} = req.body;

    const resultadoUser = await UsuarioServices.loginUsuario({username, password});

    res.status(200).json({
      mensaje: "Login exitoso",
      ...resultadoUser
    })
  } catch (err: any) {
    if(err.message === "MISSING_DATA") {
      return res.status(400).json({ error: "Username y password obligatorios"});
    }
    if(err.message === "INVALID_CREDENTIALS_USER") {
      return res.status(400).json({error: "Credenciales incorrectas del usuario"});
    }
    if(err.message === "INVALID_CREDENTIALS_PASSWORD") {
      return res.status(400).json({error: "Credenciales incorrectas del password"});
    }

    next(err);
  }
}

export const editarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { username, rol } = req.body;

    await UsuarioServices.actualizarDatos(id, username, rol, req.user);

    res.json({
      mensaje: "Usuario actualizado correctamente",
      id,
      username
    });
  } catch (err: any) {
    const errorMap: Record<string, {status: number, msg: string}> = {
      "UNAUTHENTICATED": {status: 401, msg: "No has iniciado sesión"},
      "NOT_FOUND_ID": {status: 400, msg: "El ID proporcionado no es valido"},
      "USER_NOT_FOUND": {status: 404, msg: "Usuario no encontrado"},
      "UNAUTHORIZED_ACCESS": {status: 403, msg: "No tienes permiso para editar este perfil"},
    }

    const errors = errorMap[err.message];
    if(errors) return res.status(errors.status).json({error: errors.msg});

    next(err);
  }
}

export const eliminarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await UsuarioServices.eliminarUsuario(id, req.user);
  
    res.json({
      mensaje: "Usuario eliminado correctamente",
      id
    });
  } catch (err: any) {
    const errorMap: Record<string, {status: number, msg: string}> = {
      "UNAUTHENTICATED": {status: 401, msg: "No has iniciado sesión"},
      "NOT_FOUND_ID": {status: 400, msg: "El ID proporcionado no es valido"},
      "USER_NOT_FOUND": {status: 404, msg: "Usuario no encontrado"},
      "UNAUTHORIZED_ACCESS": {status: 403, msg: "Solo los administradores pueden eliminar usuarios"},
    }

    const errors = errorMap[err.message];
    if(errors) return res.status(errors.status).json({error: errors.msg});

    next(err);
  }
}

export const actualizarPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const {newPassword} = req.body;

    await UsuarioServices.actualizarPassword(id, newPassword, req.user!);

    res.json({
      mensaje: "Contraseña actualizada correctamente",
      id
    });
  } catch (err: any) {
    const errorMap: Record<string, {status: number, msg: string}> = {
      "UNAUTHENTICATED": {status: 401, msg: "No has iniciado sesión"},
      "NOT_FOUND_ID": {status: 400, msg: "El ID proporcionado no es valido"},
      "MISSING_DATA": {status: 400, msg: "La nueva contraseña es obligatoria"},
      "UNAUTHORIZED_ACCESS": {status: 403, msg: "No tienes permiso para cambiar esta contraseña"},
    }

    const errors = errorMap[err.message];
    if(errors) return res.status(errors.status).json({error: errors.msg});

    next(err);
  }
}