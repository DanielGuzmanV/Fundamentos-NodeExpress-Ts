import db from '../config/database.js';
import { Categoria } from '../types/index.js';

const CategoriaModel = {

  // Obtener todas las categorias
  getAll: (): Promise<Categoria[]> => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM categorias WHERE activo = 1";
      db.all(sql, [], (err, filas) => {
        if(err) return reject(err);
        resolve(filas as Categoria[]);
      });
    });
  },

  // Crear una categoria
  create: (nombre: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO categorias (nombre) VALUES (?)";
      db.run(sql, [nombre], function(err) {
        if(err) return reject(err);
        resolve();
      });
    });
  },

  // Actualizar el nombre de una categoria
  update: (id: number, nuevoNombre: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE categorias SET nombre = ? WHERE id = ?";

      db.run(sql, [nuevoNombre, id], function(err) {
        if(err) return reject(err);

        if(this.changes === 0) {
          return reject(new Error("No se encontro la categoria con ese ID"));
        };

        resolve();
      });
    });
  },

  // Oculatar una categoria
  deleteLogical: (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE categorias SET activo = 0 WHERE id = ? AND activo = 1";
      
      db.run(sql, [id], function(err) {
        if(err) return reject(err);

        if(this.changes === 0) {
          return reject(new Error("La categoria no existe o ya esta oculta"));
        }
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
        if(this.changes === 0) return reject(new Error("La categoria ya esta activa o no existe"));
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
        if(this.changes === 0) return reject(new Error("No se encontro la categoria para eliminar"));
        resolve();
      });
    });
  },

  // Eliminar toda la tabla de categorias
  deleteAll:(): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM categorias";
      db.run(sql, [], function(err) {
        if(err) return reject(err);
        if(this.changes === 0) return reject(new Error("No se encontraron categorias para eliminar"));
        resolve();
      })
    })
  }
}

export default CategoriaModel;