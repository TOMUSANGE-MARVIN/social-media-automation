import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import db from '../db.js';
import { randomUUID } from 'crypto';

const router = Router();

// POST /api/schedule-delete  { postId, deleteAt }
router.post('/', requireAuth, async (req, res) => {
  const { postId, deleteAt } = req.body;
  if (!postId || !deleteAt) return res.status(400).json({ error: 'postId and deleteAt required' });

  const deleteDate = new Date(deleteAt);
  if (isNaN(deleteDate.getTime()) || deleteDate <= new Date()) {
    return res.status(400).json({ error: 'deleteAt must be a future date' });
  }

  // Remove any existing schedule for this post, then insert new one
  await db('scheduled_deletions').where({ user_id: req.userId, post_id: postId }).delete();
  await db('scheduled_deletions').insert({
    id: randomUUID(),
    user_id: req.userId,
    post_id: postId,
    delete_at: deleteDate,
  });

  res.json({ ok: true });
});

// DELETE /api/schedule-delete/:postId
router.delete('/:postId', requireAuth, async (req, res) => {
  await db('scheduled_deletions')
    .where({ user_id: req.userId, post_id: req.params.postId })
    .delete();
  res.json({ ok: true });
});

export default router;
