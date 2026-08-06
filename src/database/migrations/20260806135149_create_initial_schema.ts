import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  // Tabla de Usuarios:
  await knex.schema.createTable("usuarios", (table) => {
    table.increments("id").primary();
    table.string("nombre").notNullable();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.string("rol").defaultTo("vendedor");
    table.timestamp("fecha_creacion").defaultTo(knex.fn.now());
  })

  // Tabla de Categorias:
  await knex.schema.createTable("categorias", (table) => {
    table.increments("id").primary();
    table.string("nombre").notNullable().unique();
    table.integer("activo").defaultTo(1);
  });

  // Tabla de Fabricantes:
  await knex.schema.createTable("fabricantes", (table) => {
    table.increments("id").primary();
    table.string("nombre").notNullable().unique();
    table.integer("activo").defaultTo(1);
  });

  // Tabla de Productos (Depende de categorias y fabricantes):
  await knex.schema.createTable("productos", (table) => {
    table.increments("id").primary();
    table.string("nombre").notNullable();
    table.double("precio").notNullable();
    table.integer("stock").notNullable();
    table.integer("activo").defaultTo(1);

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

  // Tabla de Pedidos (Depende de usuarios):
  await knex.schema.createTable("pedidos", (table) => {
    table.increments("id").primary();
    table.timestamp("fecha").defaultTo(knex.fn.now());
    table.string("estado").notNullable();

    table.integer("id_usuario")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("usuarios")
      .onDelete("RESTRICT");
  });

  // Tabla Detalles de Pedidos (Depende de pedidos y productos):
  await knex.schema.createTable("detalles_pedidos", (table) => {
    table.increments("id").primary();
    table.integer("cantidad").notNullable();
    table.double("precio_unitario").notNullable();

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
  });
}


export async function down(knex: Knex): Promise<void> {
  // Eliminamos en orden INVERSO para no violar restricciones de Foreign keys
  await knex.schema.dropTableIfExists("detalles_pedidos");
  await knex.schema.dropTableIfExists("pedidos");
  await knex.schema.dropTableIfExists("productos");
  await knex.schema.dropTableIfExists("fabricantes");
  await knex.schema.dropTableIfExists("categorias");
  await knex.schema.dropTableIfExists("usuarios");
}

