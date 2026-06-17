import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta del archivo para la base de datos
const dbPath = path.resolve(__dirname, '../../inventario_knex.db');

const db = knex({
  client: "sqlite3",
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
  debug: true
});

// Habilitacion de las llaves foraneas para SQLite de forma nativa con knex
db.raw("PRAGMA foreign_keys = ON;")
  .then(() => {
    console.log("Knex: llaves foraneas activadas con exito");
  })
  .catch((err) => {
    console.log("Error al activar llaves foraneas:", err.message);
  });

console.log("Inicializado: Conectado a SQLite via knex.js");

export default db;