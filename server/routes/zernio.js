import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();
const ZERNIO = 'https://zernio.com/api/v1';

function zHeaders() {
  return {
    Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

function getProfileId(userId) {
  return db.prepare('SELECT zernio_profile_id FROM users WHERE id = ?').get(userId)?.zernio_profile_id;
}

async function proxy(res, url, options = {}) {
  try {
    const zRes = await fetch(url, { headers: zHeaders(), ...options });
    const data = await zRes.json().catch(() => ({}));
    res.status(zRes.status).json(data);
  } catch (err) {
    console.error('[Zernio proxy]', err.message);
    res.status(502).json({ error: 'Failed to reach Zernio API' });
  }
}

// POST /api/zernio/media/presign
router.post('/media/presign', requireAuth, async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    if (!filename || !contentType) return res.status(400).json({ error: 'filename and contentType required' });
    const zRes = await fetch(`${ZERNIO}/media/presign`, {
      method: 'POST',
      headers: zHeaders(),
      body: JSON.stringify({ filename, contentType }),
    });
    const data = await zRes.json();
    res.status(zRes.status).json(data);
  } catch (err) {
    console.error('[Zernio media/presign]', err.message);
    res.status(502).json({ error: 'Failed to get presigned URL' });
  }
});

// GET /api/zernio/analytics
router.get('/analytics', requireAuth, (req, res) => {
  const profileId = getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });

  const params = new URLSearchParams({ profileId });
  ['page', 'limit', 'dateFrom', 'dateTo'].forEach((k) => {
    if (req.query[k]) params.set(k, req.query[k]);
  });
  proxy(res, `${ZERNIO}/analytics?${params}`);
});

// GET /api/zernio/accounts
router.get('/accounts', requireAuth, (req, res) => {
  const profileId = getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });
  proxy(res, `${ZERNIO}/accounts?profileId=${profileId}`);
});

// DELETE /api/zernio/accounts/:id
router.delete('/accounts/:id', requireAuth, (req, res) => {
  proxy(res, `${ZERNIO}/accounts/${req.params.id}`, { method: 'DELETE' });
});

// GET /api/zernio/connect/:platform
router.get('/connect/:platform', requireAuth, (req, res) => {
  const profileId = getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });

  const url = new URL(`${ZERNIO}/connect/${req.params.platform}`);
  url.searchParams.set('profileId', profileId);
  if (req.query.redirect_url) url.searchParams.set('redirect_url', req.query.redirect_url);
  proxy(res, url.toString());
});

// GET /api/zernio/posts
router.get('/posts', requireAuth, (req, res) => {
  const profileId = getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });

  const params = new URLSearchParams({ profileId });
  ['page', 'limit', 'status', 'platform', 'dateFrom', 'dateTo'].forEach((k) => {
    if (req.query[k]) params.set(k, req.query[k]);
  });
  proxy(res, `${ZERNIO}/posts?${params}`);
});

// POST /api/zernio/posts
router.post('/posts', requireAuth, (req, res) => {
  const profileId = getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });

  proxy(res, `${ZERNIO}/posts`, {
    method: 'POST',
    body: JSON.stringify({ ...req.body, profileId }),
  });
});

// DELETE /api/zernio/posts/:id
router.delete('/posts/:id', requireAuth, (req, res) => {
  proxy(res, `${ZERNIO}/posts/${req.params.id}`, { method: 'DELETE' });
});

// POST /api/zernio/posts/:id/retry
router.post('/posts/:id/retry', requireAuth, (req, res) => {
  proxy(res, `${ZERNIO}/posts/${req.params.id}/retry`, { method: 'POST', body: '{}' });
});

export default router;
