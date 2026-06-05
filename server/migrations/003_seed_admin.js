// One-time seed: creates the default admin account if it does not already exist.
// Password hash is bcrypt(cost=12) of the initial password.
const ADMIN_ID    = '00000000-0000-0000-0000-000000000001';
const ADMIN_EMAIL = 'postify@admin.com';
// bcrypt hash of "vinco256" at cost 12
const ADMIN_HASH  = '$2a$12$nXL.VEWgajRkoo6j0bTcm.3AXH3FquRGouq6goXbZta0j/6GkgliC';

export async function up(knex) {
  const existing = await knex('users').where({ email: ADMIN_EMAIL }).first('id');
  if (existing) return;
  await knex('users').insert({
    id:            ADMIN_ID,
    name:          'Admin',
    email:         ADMIN_EMAIL,
    password_hash: ADMIN_HASH,
    is_admin:      true,
    plan:          'free',
    paid_account_slots: 0,
  });
}

export async function down(knex) {
  await knex('users').where({ id: ADMIN_ID }).delete();
}
