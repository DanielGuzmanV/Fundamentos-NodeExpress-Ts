import db from '../config/database.js';
import { Producto } from '../types/index.js';
import { FiltrosProducto } from '../types/productos.js';

const ProductoModel = {

  // Consulta 1: obtener todos los productos con filtros
  getAll: (filtros: FiltrosProducto): Promise<Producto[]> => {
    return new Promise((resolve, reject) => {
      const {min_precio, nombre, orden, limite, pagina } = filtros;
      
      // Obtenemos todos los productos que estan activos
      let sql = `
        SELECT p.*, c.nombre AS categoria_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.activo = 1
      `;
      let parametros: any[] = [];

      // Filtros dinamicos
      if(min_precio) {
        sql += " AND p.precio <= ?";
        parametros.push(min_precio);
      }

      if(nombre) {
        sql += " AND p.nombre LIKE ?";
        parametros.push(`${nombre}%`);
      }

      // Ordenamientos
      if(orden === 'caro') sql += " ORDER BY p.precio DESC";
      else if(orden === 'barato') sql += " ORDER BY p.precio ASC";
      else if(orden === 'nombre') sql += " ORDER BY p.nombre ASC";

      // Paginacion
      const resPorPagina = parseInt(String(limite || 5));
      const pagActual = parseInt(String(pagina || 1));
      const offset = (pagActual - 1) * resPorPagina;

      sql += " LIMIT ? OFFSET ?";
      parametros.push(resPorPagina, offset);

      db.all(sql, parametros, (err, rows) => {
        if(err) return reject(err);
        resolve(rows as Producto[]);
      });
    });
  },

  // Consulta 2: obtener un producto por ID
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