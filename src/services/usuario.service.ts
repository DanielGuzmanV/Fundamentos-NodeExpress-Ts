import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsuarioModel from "../models/usuario.model.js";
import { User, UserPayload } from "../types/user.js";

const UsuarioServices = {

  // Listas todos los usuarios:
  listarUsuarios: async () => {
    return await UsuarioModel.getAll();
  },

  // Obtener un usuario por ID
  obtenerUsuarioPorId: async (id: string[] | string | undefined, userLogueado?: UserPayload) => {
    const idNum = Number(id);
    if (!userLogueado) throw new Error("UNAUTHENTICATED");

    if(isNaN(idNum)) throw new Error("NOT_FOUND_ID");

    // logica de autorizacion
    if(userLogueado.rol !== 'admin' && userLogueado.id !== idNum) {
      throw new Error("UNAUTHORIZED_ACCESS");
    }

    const usuario = await UsuarioModel.getById(idNum);
    if(!usuario) throw new Error("USER_NOT_FOUND");

    return usuario;
  },

  // Registrar un nuevo usuario:
  registrarUsuario: async (datos: User) => {
    const {username, password, nombre, apellido, email, telefono, rol} = datos;

    // Validar que no falten campos obligatorios
    if(!username || !password || !nombre || !apellido || !email || !telefono) {
      throw new Error("MISSING_DATA");
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) throw new Error("INVALID_EMAIL_FORMAT");

    // Validar telefono (minimo 7-8 digitos, solo numeros)
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(telefono)) throw new Error("INVALID_PHONE_FORMAT");

    // Validacion si ya existe el nombre del usuario
    const usuarioExistente = await UsuarioModel.getByUsername(username);
    if(usuarioExistente) throw new Error("USER_ALREADY_EXISTS");

    // Validacion si ya existe el email
    const emailExistente = await UsuarioModel.getByEmail(email);
    if (emailExistente) throw new Error("EMAIL_ALREADY_EXISTS");

    // Encriptar la contraseña antes de enviarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const resultado = await UsuarioModel.create({
      ...datos,
      password: hashedPassword,
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

    if(!username || !password) throw new Error("MISSING_DATA");

    // Buscamos si el usuario existe
    const usuario = await UsuarioModel.getByUsername(username);
    if(!usuario) throw new Error("INVALID_CREDENTIALS_USER");

    // Comparar las contraseñas enviada con el hash
    const coincide = await bcrypt.compare(password, usuario.password);
    if(!coincide) throw new Error("INVALID_CREDENTIALS_PASSWORD");

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
    if(!userLogueado) throw new Error("UNAUTHENTICATED");

    const idNum = Number(id);
    if(isNaN(idNum)) throw new Error("NOT_FOUND_ID");

    // logica de autorizacion
    if(userLogueado.rol !== 'admin' && userLogueado.id !== idNum) {
      throw new Error("UNAUTHORIZED_ACCESS");
    }

    const userExiste = await UsuarioModel.getById(idNum);
    if(!userExiste) throw new Error("USER_NOT_FOUND");

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

  // Cambiar la contraseña
  actualizarPassword: async (
    id: string[] | string | undefined, 
    newPassword: string,
    userLogueado: UserPayload
  ) => {
    if(!userLogueado) throw new Error("UNAUTHENTICATED");

    const idNum = Number(id);
    if(isNaN(idNum)) throw new Error("NOT_FOUND_ID");

    // Logica de autorizacion
    if(userLogueado.rol !== 'admin' && userLogueado.id !== idNum) {
      throw new Error("UNAUTHORIZED_ACCESS");
    }

    if(!newPassword) throw new Error("MISSING_DATA");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    return await UsuarioModel.updatePassword(idNum, hashedPassword);
  },

  // Eliminar/ocultar usuario
  ocultarUsuario: async (id: string[] | string | undefined, userLogueado?: UserPayload) => {
    if(!userLogueado || userLogueado.rol !== 'admin') {
      throw new Error("UNAUTHORIZED_ACCESS");
    }

    const idNum = Number(id);
    if(isNaN(idNum)) throw new Error("NOT_FOUND_ID");

    const userExiste = await UsuarioModel.getById(idNum);
    if(!userExiste) throw new Error("USER_NOT_FOUND");

    // Evitar que un admin se oculte asi mismo
    if(userLogueado.id === idNum) throw new Error("CANNOT_DELETE_SELF");

    return await UsuarioModel.softDelete(idNum);
  },

  // Eliminar un usuario
  eliminarUsuario: async (id: string[] | string | undefined, userLogueado?: UserPayload) => {
    if(!userLogueado) throw new Error("UNAUTHENTICATED");

    if(userLogueado.rol !== 'admin') {
      throw new Error("UNAUTHORIZED_ACCESS");
    }

    const idNum = Number(id);
    if(isNaN(idNum)) throw new Error("NOT_FOUND_ID");

    const userExiste = await UsuarioModel.getById(idNum);
    if(!userExiste) throw new Error("USER_NOT_FOUND");

    return await UsuarioModel.delete(idNum);
  }
}

export default UsuarioServices;