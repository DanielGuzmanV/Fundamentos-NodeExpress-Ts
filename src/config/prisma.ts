import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/index.js";

// Creamos el adaptador
const adapter = new PrismaBetterSqlite3({url: "inventario_prisma.db"});

const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

export default prisma;