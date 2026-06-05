import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const ZERNIO = 'https://zernio.com/api/v1';

// POST /api/admin/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await db('users')
      .where({ email })
      .first('id', 'name', 'email', 'password_hash', 'is_admin');

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.is_admin) return res.status(403).json({ error: 'Admin access required' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, admin: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('[admin/auth/login]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/auth/me
router.get('/auth/me', requireAdmin, async (req, res) => {
  try {
    const user = await db('users').where({ id: req.userId }).first('id', 'name', 'email');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ admin: user });
  } catch (err) {
    console.error('[admin/auth/me]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

function zHeaders() {
  return { Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`, 'Content-Type': 'application/json' };
}

async function fetchProfileAccounts(profileId) {
  try {
    const res = await fetch(`${ZERNIO}/accounts?profileId=${profileId}`, { headers: zHeaders() });
    return (await res.json()).accounts || [];
  } catch { return []; }
}

async function fetchProfilePosts(profileId) {
  try {
    const res = await fetch(`${ZERNIO}/posts?profileId=${profileId}&limit=100`, { headers: zHeaders() });
    return (await res.json()).posts || [];
  } catch { return []; }
}

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const day7  = new Date(Date.now() - 7  * 86400000).toISOString().slice(0, 19).replace('T', ' ');
    const day30 = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 19).replace('T', ' ');

    const [totalUsers, newUsers7d, newUsers30d, paidUsers] = await Promise.all([
      db('users').count('* as c').first().then((r) => r.c),
      db('users').where('created_at', '>=', day7).count('* as c').first().then((r) => r.c),
      db('users').where('created_at', '>=', day30).count('* as c').first().then((r) => r.c),
      db('users').whereNot({ plan: 'free' }).count('* as c').first().then((r) => r.c),
    ]);

    const usersWithProfiles = await db('users')
      .whereNotNull('zernio_profile_id')
      .select('id', 'zernio_profile_id');

    const profileAccounts = await Promise.all(
      usersWithProfiles.map(async (u) => ({
        userId: u.id,
        accounts: await fetchProfileAccounts(u.zernio_profile_id),
      }))
    );

    const allAccounts = profileAccounts.flatMap((x) => x.accounts);
    const platformCounts = {};
    for (const acc of allAccounts) {
      platformCounts[acc.platform] = (platformCounts[acc.platform] || 0) + 1;
    }

    const growth = await db('users')
      .where('created_at', '>=', day30)
      .select(db.raw('DATE(created_at) as date'), db.raw('COUNT(*) as count'))
      .groupByRaw('DATE(created_at)')
      .orderBy('date', 'asc');

    const planRows = await db('users').select('plan', db.raw('COUNT(*) as count')).groupBy('plan');
    const planDistribution = Object.fromEntries(planRows.map((r) => [r.plan, Number(r.count)]));

    res.json({
      totalUsers, newUsers7d, newUsers30d, paidUsers,
      freeUsers: totalUsers - paidUsers,
      totalAccounts: allAccounts.length,
      platformCounts,
      growth,
      planDistribution,
    });
  } catch (err) {
    console.error('[admin/stats]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/users?page&limit&search
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  || '1'));
    const limit  = Math.min(50, parseInt(req.query.limit || '20'));
    const search = (req.query.search || '').trim();
    const offset = (page - 1) * limit;

    let query = db('users').select(
      'id', 'name', 'email', 'zernio_profile_id', 'created_at', 'plan', 'paid_account_slots', 'is_admin'
    );
    let countQuery = db('users').count('* as c');

    if (search) {
      const like = `%${search}%`;
      query      = query.where((q) => q.whereLike('name', like).orWhereLike('email', like));
      countQuery = countQuery.where((q) => q.whereLike('name', like).orWhereLike('email', like));
    }

    const [users, countRow] = await Promise.all([
      query.orderBy('created_at', 'desc').limit(limit).offset(offset),
      countQuery.first(),
    ]);
    const total = countRow.c;

    const enriched = await Promise.all(
      users.map(async (u) => {
        const accounts = u.zernio_profile_id ? await fetchProfileAccounts(u.zernio_profile_id) : [];
        return { ...u, accountCount: accounts.length, platforms: [...new Set(accounts.map((a) => a.platform))] };
      })
    );

    res.json({ users: enriched, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[admin/users]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.params.id })
      .first('id', 'name', 'email', 'zernio_profile_id', 'created_at', 'plan', 'paid_account_slots', 'is_admin');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const [accounts, posts] = await Promise.all([
      user.zernio_profile_id ? fetchProfileAccounts(user.zernio_profile_id) : [],
      user.zernio_profile_id ? fetchProfilePosts(user.zernio_profile_id)    : [],
    ]);

    const postStats = { total: posts.length, published: 0, scheduled: 0, failed: 0, draft: 0 };
    for (const p of posts) if (p.status in postStats) postStats[p.status]++;

    res.json({ user, accounts, postStats, recentPosts: posts.slice(0, 15) });
  } catch (err) {
    console.error('[admin/users/:id]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/users/:id
router.patch('/users/:id', requireAdmin, async (req, res) => {
  try {
    const allowed = ['plan', 'paid_account_slots', 'is_admin'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    if (!Object.keys(updates).length) return res.status(400).json({ error: 'No valid fields' });

    await db('users').where({ id: req.params.id }).update(updates);
    res.json({ ok: true });
  } catch (err) {
    console.error('[admin/users PATCH]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
