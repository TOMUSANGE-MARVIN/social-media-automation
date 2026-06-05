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

async function getProfileId(userId) {
  const row = await db('users').where({ id: userId }).first('zernio_profile_id');
  return row?.zernio_profile_id ?? null;
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

router.post('/media/presign', requireAuth, async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    if (!filename || !contentType)
      return res.status(400).json({ error: 'filename and contentType required' });
    const zRes = await fetch(`${ZERNIO}/media/presign`, {
      method: 'POST', headers: zHeaders(), body: JSON.stringify({ filename, contentType }),
    });
    res.status(zRes.status).json(await zRes.json());
  } catch (err) {
    console.error('[Zernio media/presign]', err.message);
    res.status(502).json({ error: 'Failed to get presigned URL' });
  }
});

router.get('/analytics', requireAuth, async (req, res) => {
  const profileId = await getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });
  const params = new URLSearchParams({ profileId });
  ['page', 'limit', 'dateFrom', 'dateTo'].forEach((k) => { if (req.query[k]) params.set(k, req.query[k]); });
  proxy(res, `${ZERNIO}/analytics?${params}`);
});

router.get('/accounts', requireAuth, async (req, res) => {
  const profileId = await getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });
  proxy(res, `${ZERNIO}/accounts?profileId=${profileId}`);
});

router.delete('/accounts/:id', requireAuth, (req, res) => {
  proxy(res, `${ZERNIO}/accounts/${req.params.id}`, { method: 'DELETE' });
});

router.get('/connect/:platform', requireAuth, async (req, res) => {
  const profileId = await getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });
  const url = new URL(`${ZERNIO}/connect/${req.params.platform}`);
  url.searchParams.set('profileId', profileId);
  if (req.query.redirect_url) url.searchParams.set('redirect_url', req.query.redirect_url);
  proxy(res, url.toString());
});

router.get('/posts', requireAuth, async (req, res) => {
  const profileId = await getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });
  const params = new URLSearchParams({ profileId });
  ['page', 'limit', 'status', 'platform', 'dateFrom', 'dateTo'].forEach((k) => {
    if (req.query[k]) params.set(k, req.query[k]);
  });
  proxy(res, `${ZERNIO}/posts?${params}`);
});

router.post('/posts', requireAuth, async (req, res) => {
  const profileId = await getProfileId(req.userId);
  if (!profileId) return res.status(400).json({ error: 'No Zernio profile associated with your account' });
  proxy(res, `${ZERNIO}/posts`, {
    method: 'POST', body: JSON.stringify({ ...req.body, profileId }),
  });
});

router.delete('/posts/:id', requireAuth, (req, res) => {
  proxy(res, `${ZERNIO}/posts/${req.params.id}`, { method: 'DELETE' });
});

router.post('/posts/:id/retry', requireAuth, (req, res) => {
  proxy(res, `${ZERNIO}/posts/${req.params.id}/retry`, { method: 'POST', body: '{}' });
});

export default router;
