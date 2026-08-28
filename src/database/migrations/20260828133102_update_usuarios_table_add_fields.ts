import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("usuarios", (table) => {
    table.string("apellido").notNullable().defaultTo("");
    table.string("telefono").notNullable();
    table.integer("activo").notNullable().defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("usuarios", (table) => {
    table.dropColumn("apellido");
    table.dropColumn("telefono");
    table.dropColumn("activo");
  })
}

