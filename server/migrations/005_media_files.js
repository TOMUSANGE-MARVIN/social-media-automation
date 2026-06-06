// Tracks uploaded media files so storage can be reclaimed when posts are deleted.
export async function up(knex) {
  await knex.schema.createTable('media_files', (t) => {
    t.string('id', 36).primary();
    t.string('user_id', 36).notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('public_url', 512).notNullable();
    t.bigInteger('size_bytes').notNullable().defaultTo(0);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index('user_id');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('media_files');
}
