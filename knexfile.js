import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "./inventario_knex.db"),
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => {
        conn.run("PRAGMA foreign_keys = ON;", cb);
      },
    },
    migrations: {
      directory: "./src/database/migrations",
      extension: "ts",
    }
  }
};

export default config;