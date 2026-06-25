import db from "../config/database.js";
import { Venta, VentaUsuario } from "../types/venta.js";

export const VentaModel = {

  // Obtener todas las ventas
  getAll: async (): Promise<Venta[]> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          v.id, v.cantidad, v.precio_unidad, v.total, v.fecha, v.activo,
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
  },

  // Obtener el reporte de ventas agrupados por usuario
  getSalesByUser: async (): Promise<VentaUsuario[]> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          u.id AS usuario_id,
          u.username AS usuario_username,
          SUM(v.total) AS total_ventas,
          COUNT(v.id) AS cantidad_ventas
        FROM ventas v
        JOIN usuarios u ON v.usuario_id = u.id
        GROUP BY u.id, u.username
        ORDER BY total_ventas DESC;
      `;
      db.all(sql, [], (err, rows) => {
        if(err) return reject(err);
        resolve(rows as VentaUsuario[]);
      })
    })
  },

  // Cancelar una venta y reponer el stock 
  cancelSale: async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION;"); // Iniciar la transaccion

        // Obtener detalles de la venta a cancelar para saber que reponer
        const getVentaSql = `SELECT producto_id, cantidad FROM ventas WHERE id = ? AND activo = 1;`;
        db.get(getVentaSql, [id], (err, row: Venta | undefined) => {
          if(err) {
            db.run("ROLLBACK;");
            return reject(err);
          }
          if(!row) {
            // Si no encuentra la venta o ya esta inactiva lanza un error
            db.run("ROLLBACK;");
            return reject(new Error("SALE_NOT_FOUND_OR_INACTIVE"));
          }

          const {producto_id, cantidad} = row;

          // Marcar la venta como inactiva
          const updateVentaSql = `UPDATE ventas SET activo = 0 WHERE id = ? AND activo = 1;`;
          db.run(updateVentaSql, [id], function (err) {
            if(err) {
              db.run('ROLLBACK;');
              return reject(err);
            }
            if(this.changes === 0) {
              db.run("ROLLBACK;");
              return reject (new Error("SALE_CANCEL_UPDATE_FAILED"));
            }

            // Reponemos el stock del producto
            const updateStockSql = `UPDATE productos SET stock = stock + ? WHERE id = ?;`;
            db.run(updateStockSql, [cantidad, producto_id], function(err) {
              if(err) {
                db.run("ROLLBACK;");
                return reject(err);
              }
              if(this.changes === 0) {
                db.run("ROLLBACK;");
                return reject(new Error("STOCK_REPLENISH_FAILED"));
              }

              // Si todo fue bien, entonces confirmamos la transaccion
              db.run("COMMIT;", (commitErr) => {
                if(commitErr) {
                  db.run("ROLLBACK;");
                  return reject(commitErr);
                }
                resolve();
              });
            });
          });
        });
      });
    });
  }

};

