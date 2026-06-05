export async function up(knex) {
  const exists = await knex.schema.hasTable('users');
  if (exists) return;
  await knex.schema.createTable('users', (t) => {
    t.string('id', 36).primary();
    t.string('name', 255).notNullable();
    t.string('email', 255).notNullable().unique();
    t.string('password_hash', 255).notNullable();
    t.string('zernio_profile_id', 255).nullable();
    t.boolean('is_admin').notNullable().defaultTo(false);
    t.string('plan', 50).notNullable().defaultTo('free');
    t.integer('paid_account_slots').notNullable().defaultTo(0);
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users');
}
