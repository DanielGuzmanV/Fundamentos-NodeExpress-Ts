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
  db.run(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
      )
    `);
  
  db.run(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        stock INTEGER NOT NULL,
        categoria_id INTEGER,
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
      )
    `);
});

export default db;