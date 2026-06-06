import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { randomUUID } from 'crypto';
import db from '../db.js';
import { storageLimit } from './storage.js';

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
    const { filename, contentType, size } = req.body;
    if (!filename || !contentType)
      return res.status(400).json({ error: 'filename and contentType required' });

    const fileSize = parseInt(size) || 0;

    // Quota check
    if (fileSize > 0) {
      const user = await db('users')
        .where({ id: req.userId })
        .first('storage_used_bytes', 'paid_storage_gb');
      const used  = Number(user?.storage_used_bytes) || 0;
      const limit = storageLimit(user || {});
      if (used + fileSize > limit) {
        return res.status(413).json({
          error: 'Storage limit reached',
          used,
          limit,
          needed: fileSize,
        });
      }
    }

    const zRes = await fetch(`${ZERNIO}/media/presign`, {
      method: 'POST', headers: zHeaders(), body: JSON.stringify({ filename, contentType }),
    });
    const data = await zRes.json();

    // Record file + increment storage usage after successful presign
    if (zRes.ok && fileSize > 0) {
      await db('users').where({ id: req.userId }).increment('storage_used_bytes', fileSize);
      if (data.publicUrl) {
        await db('media_files').insert({
          id: randomUUID(), user_id: req.userId,
          public_url: data.publicUrl, size_bytes: fileSize,
        }).catch(() => {}); // non-fatal
      }
    }

    res.status(zRes.status).json(data);
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

router.delete('/posts/:id', requireAuth, async (req, res) => {
  // Fetch the post first to know its media URLs, then free storage
  try {
    const postRes = await fetch(`${ZERNIO}/posts/${req.params.id}`, { headers: zHeaders() });
    if (postRes.ok) {
      const { post } = await postRes.json().catch(() => ({}));
      const mediaUrls = (post?.mediaItems || []).map((m) => m.url).filter(Boolean);
      if (mediaUrls.length > 0) {
        const files = await db('media_files')
          .whereIn('public_url', mediaUrls)
          .where({ user_id: req.userId })
          .select('size_bytes');
        const freed = files.reduce((sum, f) => sum + Number(f.size_bytes), 0);
        if (freed > 0) {
          await db('users').where({ id: req.userId })
            .decrement('storage_used_bytes', freed)
            .where('storage_used_bytes', '>=', freed);
          await db('media_files').whereIn('public_url', mediaUrls).where({ user_id: req.userId }).delete();
        }
      }
    }
  } catch (err) {
    console.error('[storage reclaim]', err.message);
  }
  proxy(res, `${ZERNIO}/posts/${req.params.id}`, { method: 'DELETE' });
});

router.post('/posts/:id/retry', requireAuth, (req, res) => {
  proxy(res, `${ZERNIO}/posts/${req.params.id}/retry`, { method: 'POST', body: '{}' });
});

export default router;
