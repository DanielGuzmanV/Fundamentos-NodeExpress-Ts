import knex from "knex";
import path from "path";
import { Database } from "sqlite3";
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
  debug: true,
  // Ajuste: asegura que cada conexion que use Express active las llaves foraneas 
  pool: {
    afterCreate: (conn: Database, cb: (err: Error | null) => void) => {
      conn.run("PRAGMA foreign_keys = ON;", (err) => {
        if(err) {
          console.error("Error crítico: No se pudieron activar las llaves foráneas en el pool:", err.message);
          return cb(err);
        }
        console.log("Knex Pool: Llaves foráneas activadas con éxito en esta conexión");
        cb(null)
      });
    }
  }
});

console.log("Inicializado: Conectado a SQLite via knex.js");

export default db;