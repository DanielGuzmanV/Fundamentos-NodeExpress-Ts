import db from '../config/database.js';
import { Categoria } from '../types/index.js';

const CategoriaModel = {
  // Obtener todas las categorias
  getAll: (callback: (err: Error | null, rows: Categoria[]) => void) => {
    const sql = "SELECT * FROM categorias";
    db.all(sql, [], callback);
  },

  // Crear una categoria
  create: (nombre: string, callback: (err: Error | null) => void) => {
    const sql = "INSERT INTO categorias (nombre) VALUES (?)";
    db.run(sql, [nombre], callback);
  }
}

export default CategoriaModel;