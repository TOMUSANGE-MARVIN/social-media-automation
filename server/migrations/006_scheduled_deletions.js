export async function up(knex) {
  await knex.schema.createTable('scheduled_deletions', (t) => {
    t.string('id', 36).primary();
    t.string('user_id', 36).notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('post_id', 255).notNullable();
    t.timestamp('delete_at').notNullable();
    t.boolean('executed').notNullable().defaultTo(false);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index(['delete_at', 'executed']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('scheduled_deletions');
}
