import jwt from 'jsonwebtoken';
import db from '../db.js';

export async function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    req.userId = payload.userId;

    const user = await db('users').where({ id: payload.userId }).first('is_admin');
    if (!user?.is_admin) return res.status(403).json({ error: 'Forbidden' });

    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
