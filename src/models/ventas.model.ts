import db from "../config/database.js";
import { Venta } from "../types/venta.js";

export const VentaModel = {

  // Obtener todas las ventas
  getAll: async (): Promise<Venta[]> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          v.id, v.cantidad, v.precio_unidad, v.total, v.fecha,
          p.nombre AS producto_nombre, p.precio AS producto_precio_actual, p.stock AS producto_stock_actual,
          u.username AS usuario_username
        FROM ventas v
        JOIN productos p ON v.producto_id = p.id
        JOIN usuarios u ON v.usuario_id = u.id
        ORDER BY v.fecha DESC
      `;
      db.all(sql, [], (err, rows) => {
        if(err) return reject(err);
        resolve(rows as Venta[]);
      })
    });
  },

  // Obtener una venta por ID conn detalles
  getById: async (id: number): Promise<Venta | undefined> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          v.id, v.cantidad, v.precio_unidad, v.total, v.fecha,
          p.nombre AS producto_nombre, p.precio AS producto_precio_actual, p.stock AS producto_stock_actual,
          u.username AS usuario_username
        FROM ventas v
        JOIN productos p ON v.producto_id = p.id
        JOIN usuarios u ON v.usuario_id = u.id
        WHERE v.id = ?
      `;
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row as Venta | undefined); // Mismo comentario sobre el tipo
      });
    });
  },

  // Registrar una nueva venta y actualizar el stock del producto
  create: async (venta: Venta): Promise<{id: number}> => {
    const {producto_id, usuario_id, cantidad, precio_unidad, total} = venta;
    
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION;"); // Iniciar la transaccion 

        // Insertar venta
        const insertSaleSql = `
          INSERT INTO ventas (producto_id, usuario_id, cantidad, precio_unidad, total)
          VALUES (?, ?, ?, ?, ?);
        `;

        db.run(insertSaleSql, [producto_id, usuario_id, cantidad, precio_unidad, total], function(err) {
          if(err) {
            db.run("ROLLBACK;"); // Si falla la venta, se revierte
            return reject(err);
          }
          const ventaId = this.lastID;

          // Actualizar el stock del producto
          const updateStockSql = `
            UPDATE productos
            SET stock = stock - ?
            WHERE id = ? AND stock >= ?;
          `;
          db.run(updateStockSql, [cantidad, producto_id, cantidad], function(err) {
            if(err) {
              db.run("ROLLBACK;");
              return reject(err);
            }
            // Si this.changes es 0 entonces indica que el stock era insuficiente
            if(this.changes === 0) {
              db.run("ROLLBACK;");
              return reject(new Error("INSUFFICIENT_STOCK"));
            }

            // Si todo fue bien, se confirma la transaccion
            db.run("COMMIT;", (commitErr) => {
              if(commitErr) {
                db.run("ROLLBACK;");
                return reject(commitErr);
              }
              resolve({id: ventaId});
            })
          })
        })
      })
    })
  }
};

