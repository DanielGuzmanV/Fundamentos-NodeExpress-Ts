import db from "../config/database.js";
import { User } from "../types/user.js";

export const UsuarioModel = {

  // Obtener todos los usuarios
  getAll: async (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, username, nombre, apellido, email, telefono, rol, activo, fecha_creacion 
        FROM usuarios 
        WHERE activo = 1
        ORDER BY id DESC
      `;

      db.all(sql, [], (err, rows) => {
        if(err) return reject(err);
        resolve(rows as User[]);
      })
    })
  },

  // Crear un nuevo usuario:
  create: async (datos: User): Promise<{id: number}> => {
    const {username, password, nombre, apellido, email, telefono, rol} = datos;
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO usuarios (username, password, nombre, apellido, email, telefono, rol) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(sql, [username, password, nombre, apellido, email, telefono, rol || 'vendedor'], function(err) {
        if(err) return reject(err);
        resolve({id: this.lastID});
      })
    })
  },

  // Buscar un usuario por el username para el login
  getByUsername: async (username: string): Promise<User | undefined> => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM usuarios WHERE username = ? AND activo = 1";

      db.get(sql, [username], (err, row) => {
        if(err) return reject(err);
        resolve(row as User | undefined);
      })
    })
  },

  // Obtener un usuario por el ID
  getById: async (id: number): Promise<User | undefined> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, username, nombre, apellido, email, telefono, rol, activo, fecha_creacion 
        FROM usuarios WHERE id = ?
        AND activo = 1
      `;

      db.get(sql, [id], (err, row) => {
        if(err) return reject(err);
        resolve(row as User | undefined);
      })
    })
  },

  // Obtener un usuario por el ID incluyendo la contraseña
  getByIdWithPassword: async (id: number): Promise<User | undefined> => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM usuarios WHERE id = ? AND activo = 1`;
      db.get(sql, [id], (err, row) => {
        if(err) return reject(err);
        resolve(row as User | undefined);
      })
    })
  },

  // Buscar usuario por el email (para validaciones)
  getByEmail: async (email: string): Promise<User | undefined> => {
    return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM usuarios WHERE email = ? AND activo = 1";
    db.get(sql, [email], (err, row) => {
      if(err) return reject(err);
      resolve(row as User | undefined);
    });
  });
  },

  // Obtener un usuario por el ID si esta activo o no
  getByIdNoFilter: async (id: number): Promise<User | undefined> => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM usuarios WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if(err) return reject(err);
      resolve(row as User | undefined);
    });
  });
},

  // Actualizar todos los datos generales
  updateInfo: async (id: number, datos: Partial<User>): Promise<void> => {
    const {username, nombre, apellido, telefono, rol} = datos;

    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE usuarios SET 
          username = ?, 
          nombre = ?,
          apellido = ?,
          telefono = ?,
          rol = ?
        WHERE id = ? AND activo = 1
      `;

      db.run(sql, [username, nombre, apellido, telefono, rol, id], function(err) {
        if(err) return reject(err);
        resolve();
      })
    })
  },

  // Actualizar algunos datos
  updatePartial: async (id: number, datos: Partial<User>): Promise<void> => {
    const { username, nombre, apellido, telefono, rol} = datos;
    const camposFiltrados: Record<string, any> = { username, nombre, apellido, telefono, rol };

    // Filtrar los campos que son undefined
    const keys = Object.keys(camposFiltrados).filter(
      (key) => camposFiltrados[key as keyof User] !== undefined
    );

    if(keys.length === 0) return;

    // Construimos el sql dinamico
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => camposFiltrados[key as keyof User]);
    values.push(id);

    return new Promise((resolve, reject) => {
      const sql = `UPDATE usuarios SET ${setClause} WHERE id = ? AND activo = 1`;

      db.run(sql, values, function(err) {
        if(err) return reject(err);
        resolve();
      })
    });
  },

  // Actualizar el email del usuario
  updateEmail: async () => {
    // Se agregara luego...
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

  // Eliminar (ocultar un usuario) por el ID
  softDelete: async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE usuarios SET activo = 0 WHERE id = ? AND activo = 1";

      db.run(sql, [id], function(err) {
        if(err) return reject(err);
        resolve();
      })
    })
  },

  // Mostrar nuevamente un usuario ocultado
  showUser: async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE usuarios SET activo = 1 WHERE id = ? AND activo = 0";

      db.run(sql, [id], function(err) {
        if(err) return reject(err);
        resolve();
      })
    })
  },
  
  // Eliminar un usuario por el ID
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