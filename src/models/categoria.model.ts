import db from '../config/database.js';
import { Categoria } from '../types/index.js';

const CategoriaModel = {

  // Obtener todas las categorias
  getAll: async (): Promise<Categoria[]> => {
    const filas = await db<Categoria>('categorias')
      .select('*')
      .where('activo', 1);
    
    return filas;
  },

  // Busqueda por Id y verifica si esta activo
  getById: async (id: number): Promise<Categoria | undefined> => {
    const fila = await db<Categoria>('categorias')
      .where('id', id)
      .andWhere('activo', 1)
      .first();
    
    return fila;
  },
  
  // Busqueda por Id
  getByIdSinFiltro: async (id: number): Promise<Categoria | undefined> => {
    const fila = await db<Categoria>('categorias')
      .where('id', id)
      .andWhere('activo', 0)
      .first();

    return fila;
  },
  
  // Crear una categoria
  create: async (nombre: string): Promise<void> => {
    await db('categorias').insert({nombre});
  },
  
  // Actualizar el nombre de una categoria
  update: async (id: number, nuevoNombre: string): Promise<void> => {
    await db('categorias')
    .where('id', id)
    .update({nombre: nuevoNombre});
  },
  
  // Oculatar una categoria
  deleteLogical: async (id: number): Promise<void> => {
    await db('categorias')
      .where('id', id)
      .andWhere('activo', 1)
      .update({activo: 0});
  },
  
  // Mostrar una categoria ocultada
  activarCategoria: async (id: number): Promise<void> => {
    await db('categorias')
      .where('id', id)
      .andWhere('activo', 0)
      .update({activo: 1});
  },
    
  // Borrar una categoria (Borrado fisico)
  deleteCategoria: async (id: number): Promise<void> => {
    await db('categoria')
    .where('id', id)
    .del();
  },
  
  // Contar el total de registros
  countAll: async (): Promise<number> => {
    const resultado = await db('categorias')
      .count('* as Total')
      .first();
    
    return resultado ? Number(resultado.total) : 0;
  },

  // Eliminar toda la tabla de categorias
  deleteAll: async (): Promise<void> => {
    await db('categorias').del();
  },
}

export default CategoriaModel;