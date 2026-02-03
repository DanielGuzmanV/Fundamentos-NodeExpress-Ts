import db from '../config/database.js';
import { Producto } from '../types/index.js';

const ProductoModel = {

  // Consulta 1: obtener todos los productos
  getAll: (): Promise<Producto[]> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, c.nombre AS categoria_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
      `;
      db.all(sql, [], (err, rows) => {
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

  // Consulta 3: agregar un nuevo producto
  create: (producto: Producto): Promise<void> => {
    return new Promise((resolve, reject) => {
      const {nombre, precio, stock, categoria_id} = producto;
      const sql = "INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES (?, ?, ?, ?)";

      db.run(sql, [nombre, precio, stock, categoria_id], function(err) {
        if(err) return reject(err);
        resolve();
      });
    });
  }
}

export default ProductoModel;