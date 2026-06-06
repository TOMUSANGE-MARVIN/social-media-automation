export async function up(knex) {
  await knex.schema.alterTable('users', (t) => {
    t.bigInteger('storage_used_bytes').notNullable().defaultTo(0).after('paid_account_slots');
    t.integer('paid_storage_gb').notNullable().defaultTo(0).after('storage_used_bytes');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('users', (t) => {
    t.dropColumn('storage_used_bytes');
    t.dropColumn('paid_storage_gb');
  });
}
