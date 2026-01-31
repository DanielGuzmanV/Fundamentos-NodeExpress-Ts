import db from '../config/database.js';
import { Producto } from '../types/index.js';

const ProductoModel = {

  // Consulta 1: obtener todos los productos
  getAll: (callback: (err: Error | null, rows: any[]) => void) => {
    const sql = `
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `;
    db.all(sql, [], callback);
  },

  // Consulta 2: obtener un producto por ID
  getById: (id: number, callback: (err: Error | null, rows: Producto | undefined) => void) => {
    const sql = `
      SELECT p.*, c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `;
    db.get(sql, [id], callback);
  },

  // Consulta 3: agregar un nuevo producto
  create: (producto: Producto, callback: (err: Error | null) => void) => {
    const {nombre, precio, stock, categoria_id} = producto;
    const sql = "INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES (?, ?, ?, ?)";
    db.run(sql, [nombre, precio, stock, categoria_id], callback);
  }

}

export default ProductoModel;