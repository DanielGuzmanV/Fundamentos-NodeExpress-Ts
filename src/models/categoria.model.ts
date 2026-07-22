import db from '../config/database.js';
import prisma from '../config/prisma.js';
import { Categoria } from '../generated/prisma/index.js';

const CategoriaModel = {

  // Obtener todas las categorias (Usando prisma)
  getAll: async (): Promise<Categoria[]> => {
    return await prisma.categoria.findMany({
      where: { activo: 1 },
    });
  },

  // Busqueda por Id y verifica si esta activo (Usando prisma)
  getById: async (id: number): Promise<Categoria | null> => {
    return await prisma.categoria.findFirst({
      where: {
        id: id,
        activo: 1,
      },
    });
  },

  // Busqueda por Id sin filtro (Usando prisma)
  getByIdSinFiltro: async (id: number): Promise<Categoria | null> => {
    return await prisma.categoria.findUnique({
      where: {
        id: id,
        activo: 0
      }
    });
  },

  // Crear una categoria (Usando prisma)
  create: async (nombre: string): Promise<Categoria> => {
    return await prisma.categoria.create({
      data: { nombre: nombre }
    });
  },

  // Actualizar el nombre de una categoria (Usando prisma)
  update: async (id: number, nuevoNombre: string): Promise<Categoria> => {
    return await prisma.categoria.update({
      where: { id: id, },
      data: { nombre: nuevoNombre },
    });
  },

  // Oculatar una categoria (Usando prisma)
  deleteLogical: async (id: number): Promise<Categoria> => {
    return await prisma.categoria.update({
      where: { id: id },
      data: { activo: 0 }
    })
  },

  dedleteLogical: (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE categorias SET activo = 0 WHERE id = ? AND activo = 1";
      
      db.run(sql, [id], function(err) {
        if(err) return reject(err);
        resolve();
      })
    })
  },

  // Mostrar una categoria ocultada
  activarCategoria: (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE categorias SET activo = 1 WHERE id = ? AND activo = 0";

      db.run(sql, [id], function(err) {
        if(err) return reject(err);
        resolve();
      })
    })
  },

  // Borrar una categoria
  deleteCategoria: (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM categorias WHERE id = ?";
      
      db.run(sql, [id], function(err) {
        if(err) return reject(err);
        resolve();
      });
    });
  },

  // Contar el total de registros
  countAll: (): Promise<number> => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT COUNT(*) as total FROM categorias";
        db.get(sql, [], (err, row: any) => {
          if(err) return reject(err);
          resolve(row.total)
        })
    })
  },

  // Eliminar toda la tabla de categorias
  deleteAll:(): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM categorias";
      db.run(sql, [], function(err) {
        if(err) return reject(err);
        resolve();
      })
    })
  }
}

export default CategoriaModel;