import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Configuracion de rutas para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../inventario.db');

const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if(err) {
    console.error('Error al abrir la DB:', err.message);
  } else {
    console.log('Conectado a SQLite con TS');
    db.run("PRAGMA foreign_keys = ON;");
  }
});

db.serialize(() => {

  // Tabla categorias:
  db.run(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        activo INTEGER DEFAULT 1
      )
    `, (err) => {
      if(err) console.error("Error al crear la tabla categorias:", err.message);
      else console.log("Tabla 'Categoria' lista");
    }
  );
  
  // Tabla de productos:
  db.run(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        stock INTEGER NOT NULL,
        categoria_id INTEGER,
        activo INTEGER DEFAULT 1,
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
      )
    `, (err) => {
      if(err) console.error("Error al crear la tabla de productos");
      else console.log("Tabla 'Productos' lista");
    }
  );

  // Tabla de usuarios:
  db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        nombre TEXT, 
        apellido TEXT,
        email TEXT NULL UNIQUE,
        telefono TEXT,
        rol TEXT DEFAULT 'vendedor',
        activo INTEGER DEFAULT 1,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error("Error al crear la tabla usuarios:", err.message);
      else console.log("Tabla 'Usuarios' lista");
    }
  );

  // Tabla de ventas:
  db.run(`
      CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producto_id INTEGER NOT NULL,
        usuario_id INTEGER NOT NULL,
        cantidad INTEGER DEFAULT 1,
        precio_unidad REAL NOT NULL,
        total REAL NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        activo INTEGER DEFAULT 1,
        FOREIGN KEY (producto_id) REFERENCES productos (id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
      )
    `, (err) => {
      if (err) console.error("Error al crear la tabla de ventas:", err.message);
      else console.log("Tabla 'Ventas' lista");
    }
  );  

});

export default db;