import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsuarioModel from "../models/usuario.model.js";
import { User, UserPayload } from "../types/user.js";
import { registrarUsuarioSchema, updateEmailSchema, updatePasswordSchema } from "../schemas/user.schema.js";
import { email, ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

const UsuarioServices = {

  // Listas todos los usuarios:
  listarUsuarios: async () => {
    return await UsuarioModel.getAll();
  },

  // Obtener un usuario por ID
  obtenerUsuarioPorId: async (id: string[] | string | undefined, userLogueado?: UserPayload) => {
    const idNum = Number(id);
    if (!userLogueado) throw new AppError("No has iniciado sesión.", 401);

    if(isNaN(idNum)) throw new AppError("El ID proporcionado no es valido.", 400);

    // logica de autorizacion
    if(userLogueado.rol !== 'admin' && userLogueado.id !== idNum) {
      throw new AppError("No tienes permiso para ver este perfil.", 403);
    }

    const usuario = await UsuarioModel.getById(idNum);
    if(!usuario) throw new AppError("Usuario no encontrado.", 404);

    return usuario;
  },

  // Registrar un nuevo usuario:
  registrarUsuario: async (datos: User) => {

    // Validar los datos de entrada de zod
    let validatedDatos: User;
    try {
      validatedDatos = registrarUsuarioSchema.parse(datos) as User;
    } catch (error: unknown) {
      if(error instanceof ZodError) {
        const errorMessage = error.issues.length > 0
          ? error.issues[0]?.message
          : "Error desconocido en la validacion del registro";
        throw new AppError(`Error de validacion: ${errorMessage}`, 400);
      } else {
        throw new AppError(`Error inesperado durante la validacion del registro`, 500);
      }
    }

    const {username, password, nombre, apellido, email, telefono, rol} = validatedDatos;

    // Validacion si ya existe el nombre del usuario
    const usuarioExistente = await UsuarioModel.getByUsername(username);
    if(usuarioExistente) throw new AppError("El nombre de usuario ya existe.", 400);

    // Validacion si ya existe el email
    const emailExistente = await UsuarioModel.getByEmail(email);
    if (emailExistente) throw new AppError("El email del usuario ya existe.", 400);

    // Encriptar la contraseña antes de enviarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const resultado = await UsuarioModel.create({
      username,
      password: hashedPassword,
      nombre,
      apellido,
      email,
      telefono,
      rol: rol || 'vendedor'
    })

    // Retornar la informacion del usuario creado
    return {
      id: resultado.id,
      username, 
      rol: rol || 'vendedor'
    }
  },

  // Iniciar sesion:
  loginUsuario: async (datos: User) => {
    const {username, password} = datos;

    if(!username || !password) throw new AppError("Username y password obligatorios.", 400);

    // Buscamos si el usuario existe
    const usuario = await UsuarioModel.getByUsername(username);
    if(!usuario) throw new AppError("Credenciales incorrectas del usuario.", 400);

    // Comparar las contraseñas enviada con el hash
    const coincide = await bcrypt.compare(password, usuario.password);
    if(!coincide) throw new AppError("Credenciales incorrectas del password.", 400);

    // Generar el Token JWT
    const secret = process.env.JWT_SECRET || "clave_secreta_por_defecto";
    const token = jwt.sign(
      {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol
      },
      secret,
      {expiresIn: "2h"}
    );

    // Retornnar datos del usuario y el token
    return {
      usuario: {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol
      },
      token
    }
  },

  // Actualizar informacion basica
  actualizarDatos: async (
    id: string[] | string | undefined, 
    datosUpdate: User,
    userLogueado?: UserPayload
  ) => {
    if(!userLogueado) throw new AppError("No has iniciado sesión.", 401);

    const idNum = Number(id);
    if(isNaN(idNum)) throw new AppError("El ID proporcionado no es valido.", 404);

    // logica de autorizacion
    if(userLogueado.rol !== 'admin' && userLogueado.id !== idNum) {
      throw new AppError("No tienes permiso para editar este perfil.", 403);
    }

    const userExiste = await UsuarioModel.getById(idNum);
    if(!userExiste) throw new AppError("Usuario no encontrado.", 404);

    // Regla de negocio: Si no es admin no podra cambiarse su propio rol
    const rolEdit = userLogueado.rol === 'admin' 
      ? (datosUpdate.rol || userExiste.rol) 
      : userExiste.rol;
      
     // Construir objeto con datos válidos
    const datosModelo = {
      username: datosUpdate.username || userExiste.username,
      nombre: datosUpdate.nombre || userExiste.nombre,
      apellido: datosUpdate.apellido || userExiste.apellido,
      telefono: datosUpdate.telefono || userExiste.telefono,
      rol: rolEdit || 'vendedor'
    };

    return await UsuarioModel.updateInfo(idNum, datosModelo);
  },

  actualizarParcial: async (
    id: string[] | string | undefined,
    datosUpdate: Partial<User>,
    userLogueado?: UserPayload
  ) => {
    if(!userLogueado) throw new AppError("No has iniciado sesión.", 401);

    const idNum = Number(id);
    if(isNaN(idNum)) throw new AppError("El ID proporcionado no es valido.", 404);

    if(userLogueado.rol !== 'admin' && userLogueado.id !== idNum) {
      throw new AppError("No tienes permiso para editar este perfil.", 403);
    }

    if(userLogueado.rol !== 'admin' && datosUpdate.rol) {
      delete datosUpdate.rol;
    }

    // Eliminamos password y email por si el cliente los envió por error
    delete datosUpdate.password;
    delete datosUpdate.email;

    const userExiste = await UsuarioModel.getById(idNum);
    if(!userExiste) throw new AppError("Usuario no encontrado.", 404);

    return await UsuarioModel.updatePartial(idNum, datosUpdate);

  },

  // Cambiar la contraseña
  actualizarPassword: async (
    id: string[] | string | undefined, 
    passwords: {oldPassword: string, newPassword: string},
    userLogueado: UserPayload
  ) => {
    if(!userLogueado) throw new AppError("No has iniciado sesión.", 401);

    const idNum = Number(id);
    if(isNaN(idNum)) throw new AppError("El ID proporcionado no es valido.", 400);

    // Logica de autorizacion
    if(userLogueado.rol !== 'admin' && userLogueado.id !== idNum) {
      throw new AppError("No tienes permiso para cambiar esta contraseña", 403);
    }

    // Nueva validacion de las contraseñas con Zod
    try {
      updatePasswordSchema.parse(passwords); // Aquí se intenta validar con Zod
    } catch (error: unknown) { // El error aquí debería ser ZodError
      if (error instanceof ZodError) {
        const errorMssage = error.issues.length > 0
          ? error.issues[0]?.message
          : "Error desconocido en la validación de la contraseña.";
        throw new AppError(`Error de validacion: ${errorMssage}`, 400);
      } else {
        // En caso de que ZodError no tenga la estructura esperada o sea otro tipo de error
        throw new AppError(`Error inesperado durante la validación de la contraseña.`, 500);
      }
    }

    // Obtener el usuario para verificar la contraseña actual
    const usuario = await UsuarioModel.getByIdWithPassword(idNum);
    if(!usuario) throw new AppError("Usuario no encontrado", 404);

    // Comparar la contraseña antigua enviada con el hash guardado
    const coincide = await bcrypt.compare(passwords.oldPassword, usuario.password);
    if(!coincide) throw new AppError("La contraseña actual es incorrecta.", 401);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwords.newPassword, saltRounds);

    return await UsuarioModel.updatePassword(idNum, hashedPassword);
  },

  // Actualizar el email de un usuario
  actualizarEmail: async (
    id: string[] | string | undefined,
    newEmail: string,
    userLogueado: UserPayload
  ) => {
    if(!userLogueado) throw new AppError("No has iniciado sesión.", 401);

    const idNum = Number(id);
    if(isNaN(idNum)) throw new AppError("El ID proporcionado no es valido.", 400);

    if(userLogueado.rol !== 'admin' && userLogueado.id !== idNum) {
      throw new AppError("No tienes permiso para actualizar este email.", 403);
    }

    // Verificar el formato del nuevo email con zod
    try {
      updateEmailSchema.parse({email: newEmail});
    } catch (error: unknown) {
      if(error instanceof ZodError) {
        const errorMessage = error.issues.length > 0
          ? error.issues[0]?.message
          : "Error desconocido en la validacion del email";
        throw new AppError(`Error de validacion: ${errorMessage}`, 400);
      } else {
        throw new AppError("Error inesperado durante la validacion del email", 500);
      }
    }

    // Obtener el usuario actual para verificar si el email es el mismo
    const usuarioActual = await UsuarioModel.getById(idNum);
    if(!usuarioActual) throw new AppError("Usuario no encontrado.", 404);

    // Si el email es el mismo al nuevo no se hace nada
    if (usuarioActual.email === newEmail) {
      return { message: "El email es el mismo, no se realizó ninguna actualización." };
    }


    // Si el email es el mismo al nuevo no se hace nada
    const emailExistente = await UsuarioModel.getByEmail(newEmail);
    if(emailExistente && emailExistente.id !== idNum) {
      throw new AppError("El email ya está en uso por otro usuario.", 400); 
    }

    await UsuarioModel.updateEmail(idNum, newEmail);

    return {message: "Email actualizado correctamente"};
  },

  activarUsuario: async (id: string[] | string | undefined, userLogueado?: UserPayload) => {
    if(!userLogueado || userLogueado.rol !== 'admin') {
      throw new AppError("Solo los administradores pueden eliminar usuarios.", 403);
    }

    const idNum = Number(id);
    if(isNaN(idNum)) throw new AppError("El ID proporcionado no es valido.", 400);

    const userExist = await UsuarioModel.getByIdNoFilter(idNum);
    if(!userExist) throw new AppError("Usuario no encontrado.", 404);

    if(userExist.activo === 1) throw new AppError("El usuario ya esta activo.", 401);
    
    return await UsuarioModel.showUser(idNum);
  },

  // Eliminar/ocultar usuario
  ocultarUsuario: async (id: string[] | string | undefined, userLogueado?: UserPayload) => {
    if(!userLogueado || userLogueado.rol !== 'admin') {
      throw new AppError("Solo los administradores pueden eliminar usuarios.", 403);
    }

    const idNum = Number(id);
    if(isNaN(idNum)) throw new AppError("El ID proporcionado no es valido.", 400);

    const userExiste = await UsuarioModel.getById(idNum);
    if(!userExiste) throw new AppError("Usuario no encontrado.", 404);

    // Evitar que un admin se oculte asi mismo
    if(userLogueado.id === idNum) throw new AppError("No puedes ocultar tu propia cuenta.", 401);

    return await UsuarioModel.softDelete(idNum);
  },

  // Eliminar un usuario
  eliminarUsuario: async (id: string[] | string | undefined, userLogueado?: UserPayload) => {
    if(!userLogueado) throw new AppError("No has iniciado sesión.", 401);

    if(userLogueado.rol !== 'admin') {
      throw new AppError("Solo los administradores pueden eliminar usuarios.", 403);
    }

    const idNum = Number(id);
    if(isNaN(idNum)) throw new AppError("El ID proporcionado no es valido.", 400);

    const userExiste = await UsuarioModel.getById(idNum);
    if(!userExiste) throw new AppError("Usuario no encontrado.", 404);

    return await UsuarioModel.delete(idNum);
  }
}

export default UsuarioServices;