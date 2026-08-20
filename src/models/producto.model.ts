import db from '../config/database.js';
import prisma from '../config/prisma.js';
import { Prisma, Producto } from '../generated/prisma/index.js';
import { FiltrosProducto } from '../types/productos.js';

const ProductoModel = {

  // Consulta 1: obtener todos los productos con filtros
  getAll: async (filtros: FiltrosProducto): Promise<Producto[]> => {
    const {min_precio, nombre, orden, limite, pagina} = filtros;

    // 1. Tipado estricto para las condiciones WHERE
    const whereCondition: Prisma.ProductoWhereInput = { activo: 1 };

    if(min_precio){
      whereCondition.precio = { lte: Number(min_precio) } // Es igual: <=
    }

    if(nombre){
      whereCondition.nombre = {startsWith: nombre} // Es igual: LIKE 'nombre%'
    }

    // 2. Paginacion
    const resPorPagina = Number(limite || 10);
    const pagActual = Number(pagina || 1);
    const skip = (pagActual - 1) * resPorPagina;

    // 3. Objeto base de opciones para prisma
    const queryOptions: Prisma.ProductoFindManyArgs = {
      where: whereCondition,
      take: resPorPagina,
      skip: skip,
      include: {
        categoria: true,
      }
    }

    // 4. Se asigna orderBy solo si se solicita un orden
    if(orden === 'caro') queryOptions.orderBy = {precio: 'desc'};
    else if(orden === 'barato') queryOptions.orderBy = {precio: 'asc'};
    else if(orden === 'nombre') queryOptions.orderBy = {nombre: 'asc'};

    // 5. Ejecutamos la consulta con un tipo unificado
    return await prisma.producto.findMany(queryOptions);
  },

  // Consulta 2: obtener un producto por ID
  getById: async(id: number): Promise<Producto | null> => {
    return await prisma.producto.findFirst({
      where: {
        id,
        activo: 1,
      },
      include: {
        categoria: true,
      }
    })
  },

  // Consulta 3: para buscar producto por nombre exacto\
  getByName: async(nombre: string): Promise<Producto | null> => {
    return await prisma.producto.findFirst({
      where: {
        nombre: nombre,
        activo: 1
      }
    })
  },

  // Consulta 4: agregar un nuevo producto
  create: async(producto: Omit<Producto, 'id' | 'activo'>): Promise<Producto> => {
    const {nombre, precio, stock, categoria_id} = producto;

    return await prisma.producto.create({
      data: {
        nombre, precio, stock, categoria_id
      }
    })
  },

  // Consulta 5: actualizar los datos del producto
  update: async(id: number, datos: Omit<Producto, 'id'>): Promise<Producto> => {
    const {nombre, precio, stock, categoria_id} = datos;

    return await prisma.producto.update({
      where: { id: id },
      data: {
        nombre, precio, stock, categoria_id
      },
    })

  },

  // Consulta 6: actualizar un dato en especifico
  updatePartial: async(id:number, campos: Prisma.ProductoUpdateInput): Promise<Producto> => {
    return await prisma.producto.update({
      where: {id: id},
      data: campos
    })
  },

  // consulta 7: ocultar un producto
  updateState: async (id: number): Promise <Producto> => {
    return await prisma.producto.update({
      where: { id: id },
      data: { activo: 0 }
    })
  },

  // Consulta 8: buscar cualquier producto (activo o no)
  getAnyById: async (id: number): Promise<Producto | null> => {
    return await prisma.producto.findUnique({
      where: {id: id},
      include: {categoria: true}
    })
  },

  // Consulta 9: cambiar activo a 1 un producto ocultado
  restoreState: async (id:number): Promise<Producto> => {
    return await prisma.producto.update({
      where: {id: id},
      data: {activo: 1}
    })
  },

  // Consulta 10: Borrar un producto permanentemente por id
  delete: async (id: number): Promise<Producto> => {
    return await prisma.producto.delete({
      where: {id: id}
    })
  },

  // Consulta 11: Borrar todos los productos de la db
  deleteAll: async (): Promise<number> => {
    const result = await prisma.producto.deleteMany({})
    return result.count;
  },
}

export default ProductoModel;