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
  getByIds: async(id: number): Promise<Producto | null> => {
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

  // Analizar y preguntar varias cosas sobre la consulta 1 y 2
  getById:(id: number): Promise<Producto | undefined> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, c.nombre AS categoria
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = ? AND p.activo = 1
      `;
      db.get(sql, [id], (err, row) => {
        if(err) return reject(err);
        resolve(row as Producto);
      });
    });
  },

  // Consulta para buscar producto por nombre exacto
  getByName: (nombre: string): Promise<Producto | undefined> => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM productos WHERE nombre = ? AND activo = 1";
      db.get(sql, [nombre], (err, row) => {
        if(err) return reject(err);
        resolve(row as Producto | undefined);
      })
    })
  },

  // Consulta 3: agregar un nuevo producto
  create: (producto: Producto): Promise<number> => {
    return new Promise((resolve, reject) => {
      const {nombre, precio, stock, categoria_id} = producto;
      const sql = "INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES (?, ?, ?, ?)";

      db.run(sql, [nombre, precio, stock, categoria_id], function(err) {
        if(err) return reject(err);
        resolve(this.lastID);
      });
    });
  },

  // Consulta 4: actualizar los datos del producto
  update: (id: number, datos: Producto): Promise<number> => {
    return new Promise((resolve, reject) => {
      const {nombre, precio, stock, categoria_id} = datos;

      const sql = `
        UPDATE productos SET
        nombre = ?,
        precio = ?,
        stock = ?,
        categoria_id = ?
        WHERE id = ? AND activo = 1
      `;

      db.run(sql, [nombre, precio, stock, categoria_id, id], function(err) {
        if(err) return reject(err);
        resolve(this.changes)
      })
    })
  },

  // Consulta 5: actualizar un dato en especifico
  updatePartial: (id: number, campos: Partial<Producto>): Promise<number> => {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(campos);

      if(keys.length === 0) return reject(new Error("NO_FIELDS_TO_UPDATE"));

      const setSql = keys.map(key => `${key} = ?`).join(", ");
      const valores = Object.values(campos);
      valores.push(id);

      const sql = `UPDATE productos SET ${setSql} WHERE id = ? AND activo = 1`;

      db.run(sql, valores, function(err) {
        if(err) return reject(err);
        resolve(this.changes);
      })
    })
  },

  // consulta 6: ocultar un producto
  updateState: (id: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE productos SET activo = 0 WHERE id = ?";

      db.run(sql, [id], function(err) {
        if(err) return reject(err);
        resolve(this.changes);
      })
    })
  },

  // Consulta 7: buscar cualquier producto (activo o no)
  getAnyById: (id: number): Promise<Producto | undefined> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, c.nombre AS categoria
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = ?
      `;
      db.get(sql, [id], (err, row) => {
        if(err) return reject(err);
        resolve(row as Producto | undefined);
      })
    })
  },

  // Consulta 8: cambiar activo a 1 un producto ocultado
  restoreState: (id: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE productos SET activo = 1 WHERE id = ?";
      db.run(sql, [id], function(err) {
        if(err) return reject(err);
        resolve(this.changes);
      })
    })
  },

  // Consulta 9: Borrar un producto permanentemente por id
  delete: (id: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM productos WHERE id = ?";
      db.run(sql, [id], function(err) {
        if(err) return reject(err);
        resolve(this.changes);
      })
    })
  },

  // Consulta 10: Borrar todos los productos de la db
  deleteAll: (): Promise<number> => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM productos";
      db.run(sql, [], function(err) {
        if(err) return reject(err);
        resolve(this.changes);
      })
    })
  }

}

export default ProductoModel;