import db from "./database.js";

export const inicializarTablas = async (): Promise<void> => {
  try {
    // 1. Tabla de usuarios
    const tieneUsuarios = await db.schema.hasTable("usuarios");
    if(!tieneUsuarios) {
      await db.schema.createTable("usuarios", (table) => {
        table.increments("id").primary();
        table.string("nombre").notNullable();
        table.string("email").notNullable().unique();
        table.string("password_hash").notNullable();
        table.string("rol").defaultTo("vendedor");
        table.timestamp("fecha_creacion").defaultTo(db.fn.now());
      })
    }

    // 2. Tabla de categorias
    const tieneCategorias = await db.schema.hasTable("categorias");
    if(!tieneCategorias) {
      await db.schema.createTable("categorias", (table) => {
        table.increments("id").primary();
        table.string("nombre").notNullable().unique();
        table.integer("activo").defaultTo(1);
      });
      console.log("knex: Tabla 'categoria' creada")
    }

    // 3. Tabla de fabricantes
    const tieneFabricantes = await db.schema.hasTable("fabricantes");
    if(!tieneFabricantes) {
      await db.schema.createTable("fabricantes", (table) => {
        table.increments("id").primary();
        table.string("nombre").notNullable().unique();
        table.integer("activo").defaultTo(1);
      });
      console.log("knex: Tabla 'fabricante' creada");
    }

    // 4. Tabla de productos
    const tieneProductos = await db.schema.hasTable("productos");
    if(!tieneProductos) {
      await db.schema.createTable("productos", (table) => {
        table.increments("id").primary();
        table.string("nombre").notNullable();
        table.double("precio").notNullable();
        table.integer("stock").notNullable();
        table.integer("activo").defaultTo(1);

        // Foreign keys
        table.integer("id_categoria")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("categorias")
          .onDelete("RESTRICT");

        table.integer("id_fabricante")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("fabricantes")
          .onDelete("RESTRICT");
      });
      console.log("Knex: Tabla 'productos' creada");
    }

    // 5. Tabla de pedidos
    const tienePedidos = await db.schema.hasTable("pedidos");
    if(!tienePedidos) {
      await db.schema.createTable("pedidos", (table) => {
        table.increments("id").primary();
        table.timestamp("fecha").defaultTo(db.fn.now());
        table.string("estado").notNullable(); // 'pendiente', 'pagado', 'cancelado'

        table.integer("id_usuario")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("usuarios")
          .onDelete("RESTRICT");
      })
      console.log("knex: Tabla 'pedidos' creada")
    }

    // 6. Tabla de detalles de pedido
    const tieneDetallesPedido = await db.schema.hasTable("detalles_pedidos");
    if(!tieneDetallesPedido) {
      await db.schema.createTable("detalles_pedidos", (table) => {
        table.increments("id").primary();
        table.double("precio_unitario").notNullable();
        table.integer("cantidad").notNullable();

        table.integer("id_pedido")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("pedidos")
          .onDelete("CASCADE");

        table.integer("id_producto")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("productos")
          .onDelete("RESTRICT");
      })
      console.log("knex: Tabla 'detalles_pedidos' creada")
    }

  } catch (error: any) {
    console.error("Knex: Error al inicializar las tablas:", error.message);
  }
}

