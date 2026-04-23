import db from "../config/database.js";
import { User } from "../types/user.js";

export const UsuarioModel = {

  // Obtener todos los usuarios
  getAll: async (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, username, rol, fecha_creacion FROM usuarios ORDER BY id DESC";

      db.all(sql, [], (err, rows) => {
        if(err) return reject(err);
        resolve(rows as User[]);
      })
    })
  },

  // Crear un nuevo usuario:
  create: async (datos: User): Promise<{id: number}> => {
    const {username, password, rol} = datos;
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)";

      db.run(sql, [username, password, rol || 'vendedor'], function(err) {
        if(err) return reject(err);
        resolve({id: this.lastID});
      })
    })
  },

  // Buscar un usuario por el username para el login
  getByUsername: async (username: string): Promise<User | undefined> => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM usuarios WHERE username = ?";

      db.get(sql, [username], (err, row) => {
        if(err) return reject(err);
        resolve(row as User | undefined);
      })
    })
  },

  // Obtener un usuario por el ID
  getById: async (id: number): Promise<User | undefined> => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, username, rol, fecha_creacion FROM usuarios WHERE id = ?";

      db.get(sql, [id], (err, row) => {
        if(err) return reject(err);
        resolve(row as User | undefined);
      })
    })
  },

  // Actualizar datos generales (username y ro)
  updateInfo: async (id: number, username: string, rol: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE usuarios SET username = ?, rol = ? WHERE id = ?";

      db.run(sql, [id, username, rol], function(err) {
        if(err) return reject(err);
        resolve();
      })
    })
  },

  // Actualizar solo la contraseña 
  updatePassword: async (id: number, hashedPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE usuarios SET password = ? WHERE id = ?";

      db.run(sql, [hashedPassword, id], function(err) {
        if(err) return reject(err);
        resolve();
      })
    })
  },

  delete: async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM usuarios WHERE id = ?";

      db.run(sql, [id], function(err) {
        if(err) return reject(err);
        resolve();
      })
    })
  }
}

export default UsuarioModel;