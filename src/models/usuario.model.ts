import { ro } from "zod/locales";
import db from "../config/database.js";
import { User, Users } from "../types/user.js";
import { email } from "zod";

export const UsuarioModel = {

  // Obtener todos los usuarios
  getAll: async (): Promise<Omit<Users, 'password_hash'>[]> => {
    const usuarios = await db<Users>('usuarios')
      .select(
        'id', 'nombre','apellido','email','telefono','rol','activo','fecha_creacion')
      .where('activo', 1)
      .orderBy('id', 'desc');

    return usuarios;
  },

  // Crear un nuevo usuario:
  create: async(datos: Omit<Users, 'id' | 'activo' | 'fecha_creacion'>): Promise<Omit<Users, 'password_hash'>> => {
    const {nombre, apellido, email, telefono, password_hash, rol} = datos;
    
    const [datosUser] = await db<Users>('usuarios').insert({
      nombre, apellido, email, telefono, password_hash, rol: rol || 'vendedor'
    })

    const nuevoUsuario = await db<Users>('usuarios')
      .select('id', 'nombre', 'apellido', 'email', 'telefono', 'rol', 'activo', 'fecha_creacion')
      .where('id', datosUser)
      .first();

    return nuevoUsuario!;
  },

  // Obtener un usuario por el ID
  getById: async (id: number): Promise<Omit<Users, 'password_hash'> | undefined> => {
    const userData = await db<Users>('usuarios')
      .select('id', 'nombre','apellido', 'email', 'telefono', 'rol', 'activo', 'fecha_creacion')
      .where('id', id)
      .andWhere('activo', 1)
      .first();

    return userData;
  },


  // Obtener un usuario por el ID incluyendo la contraseña
  getByIdWithPassword: async (id: number): Promise<Users | undefined> => {
    const userData = await db<Users>('usuarios')
      .select('*')
      .where('id', id)
      .andWhere('activo', 1)
      .first();

    return userData;
  },

  // Buscar usuario por el email (para validaciones)
  getByEmail: async (emaiL: string): Promise<Users | undefined> => {
    const userData = await db<Users>('usuarios')
      .select('*')
      .where('email', emaiL)
      .andWhere('activo', 1)
      .first();
    
    return userData;
  },

  // Obtener un usuario por el ID si esta activo o no
  getByIdNoFilter: async (id: number): Promise<Omit<Users, 'password_hash'> | undefined> => {
    const userData = await db<Users>('usuarios')
      .select('id', 'nombre', 'apellido', 'email', 'telefono', 'rol', 'activo', 'fecha_creacion')
      .where('id', id)
      .first();

    return userData;
  },

  // Actualizar todos los datos generales
  updateInfo: async (id: number, datos: Partial<Users>): Promise<number> => {
    const {nombre, apellido, telefono, rol} = datos;

    const filas = await db('usuarios')
      .where('id', id)
      .andWhere('activo', 1)
      .update({nombre, apellido, telefono, rol});
    
    return filas;
  },

  // Actualizar algunos datos
  updatePartial: async (id: number, datos: Partial<Users>):Promise<number> => {
    const {id: _, password_hash: __, email: ___, ...camposActualizar } = datos;

    if(Object.keys(camposActualizar).length === 0) {
      return 0;
    }

    const filasAfectadas = await db('usuarios')
      .where('id', id)
      .andWhere('activo', 1)
      .update(camposActualizar);
    
      return filasAfectadas;
  },

  // Actualizar el email del usuario
  updateEmail: async (id: number, newEmail: string): Promise<number> => {
    const userEmail = await db('usuarios')
      .where('id', id)
      .andWhere('activo', 1)
      .update({email: newEmail});
    
    return userEmail;
  },

  // Actualizar solo la contraseña 
  updatePassword: async (id: number, hashedPassword: string): Promise<number> => {
    const userPassword = await db('usuarios')
      .where('id', id)
      .andWhere('activo', 1)
      .update({password_hash: hashedPassword})
    
    return userPassword;
  },

  // Eliminar (ocultar un usuario) por el ID
  softDelete: async (id: number): Promise<number> => {
    const filas = await db('usuarios')
      .where('id', id)
      .andWhere('activo', 1)
      .update({activo: 0});
    
    return filas;
  },

  // Mostrar nuevamente un usuario ocultado
  showUser: async (id: number): Promise<number> => {
    const filas = await db('usuarios')
      .where('id', id)
      .andWhere('activo', 0)
      .update({activo: 1});

    return filas;
  },
  
  // Eliminar un usuario por el ID
  delete: async (id: number): Promise<number> => {
    const filas = await db('usuarios')
      .where('id', id)
      .delete();
    
    return filas;
  }
}

export default UsuarioModel;