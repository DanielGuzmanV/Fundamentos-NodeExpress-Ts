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

  // Mostrar una categoria ocultada (Usando prisma)
  activarCategoria: async (id: number): Promise<Categoria> => {
    return await prisma.categoria.update({
      where: { id: id},
      data: {activo: 1}
    });
  },

  // Borrar una categoria (Usando prisma)
  deleteCategoria: async (id: number): Promise<Categoria> => {
    return await prisma.categoria.delete({
      where: {id: id}
    })
  },

  // Contar el total de registros (Usando prisma)
  countAll: async (): Promise<number> => {
    return await prisma.categoria.count();
  },

  // Eliminar toda la tabla de categorias (Usando prisma)
  deleteAll: async (): Promise<{count: number}> => {
    return await prisma.categoria.deleteMany();
  }
}

export default CategoriaModel;