import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();

export const FREE_STORAGE_BYTES = 4 * 1024 * 1024 * 1024; // 4 GB
export const PAID_GB_BYTES      = 1024 * 1024 * 1024;     // 1 GB per paid unit

export function storageLimit(user) {
  return FREE_STORAGE_BYTES + (user.paid_storage_gb || 0) * PAID_GB_BYTES;
}

// GET /api/storage — current user's usage
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.userId })
      .first('storage_used_bytes', 'paid_storage_gb');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const used  = Number(user.storage_used_bytes) || 0;
    const total = storageLimit(user);
    res.json({ used, total, paidGb: user.paid_storage_gb || 0, freeGb: 4 });
  } catch (err) {
    console.error('[storage/get]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
