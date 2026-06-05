export async function up(knex) {
  await knex.schema.alterTable('users', (t) => {
    t.string('google_id', 255).nullable().unique().after('zernio_profile_id');
    t.string('avatar_url', 512).nullable().after('google_id');
    // Allow null so Google-only users don't need a password
    t.string('password_hash', 255).nullable().alter();
  });
}

export async function down(knex) {
  await knex.schema.alterTable('users', (t) => {
    t.dropColumn('google_id');
    t.dropColumn('avatar_url');
    t.string('password_hash', 255).notNullable().alter();
  });
}
