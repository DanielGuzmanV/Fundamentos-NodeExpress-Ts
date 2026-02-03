import db from '../config/database.js';
import { Categoria } from '../types/index.js';

const CategoriaModel = {
  // Obtener todas las categorias
  getAll: (): Promise<Categoria[]> => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM categorias";
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
  }
}

export default CategoriaModel;