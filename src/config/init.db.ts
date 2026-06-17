import db from "./database.js";

export const inicializarTablas = async () => {
  try {
    // 1. Tabla de categorias
    const tieneCategorias = await db.schema.hasTable("categorias");
    if(!tieneCategorias) {
      await db.schema.createTable("categorias", (table) => {
        table.increments("id").primary();
        table.string("nombre").notNullable().unique();
        table.integer("activo").defaultTo(1);
      });
      console.log("knex: Tabla 'categoria' creada")
    }

    // 2. Tabla para productos
    const tieneProductos = await db.schema.hasTable("productos");
    if(!tieneProductos) {
      await db.schema.createTable("productos", (table) => {
        table.increments("id").primary();
        table.string("nombre").notNullable();
        table.double("precio").notNullable();
        table.integer("stock").notNullable();
        table.integer("categoria_id").references("id").inTable("categorias");
        table.integer("activo").defaultTo(1);
      });
      console.log("Knex: Tabla 'productos' creada");
    }

    // 3. Tabla de usuarios
    const tieneUsuarios = await db.schema.hasTable("usuarios");
    if (!tieneUsuarios) {
      await db.schema.createTable("usuarios", (table) => {
        table.increments("id").primary();
        table.string("username").notNullable().unique();
        table.string("password").notNullable();
        table.string("nombre").nullable();
        table.string("apellido").nullable();
        table.string("email").nullable().unique();
        table.string("telefono").nullable();
        table.string("rol").defaultTo("vendedor");
        table.integer("activo").defaultTo(1);
        table.timestamp("fecha_creacion").defaultTo(db.fn.now());
      });
      console.log("Knex: Tabla 'usuarios' creada");
    }

    // 4. Tabla de ventas
    const tieneVentas = await db.schema.hasTable("ventas");
    if (!tieneVentas) {
      await db.schema.createTable("ventas", (table) => {
        table.increments("id").primary();
        table.integer("producto_id").notNullable().references("id").inTable("productos");
        table.integer("usuario_id").notNullable().references("id").inTable("usuarios");
        table.integer("cantidad").defaultTo(1);
        table.double("precio_unidad").notNullable();
        table.double("total").notNullable();
        table.timestamp("fecha").defaultTo(db.fn.now());
      });
      console.log("Knex: Tabla 'ventas' creada");
    }

  } catch (error: any) {
    console.error("Knex: Error al inicializar las tablas:", error.message);
  }
}

