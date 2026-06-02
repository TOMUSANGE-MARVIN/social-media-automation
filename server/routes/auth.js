import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const ZERNIO = 'https://zernio.com/api/v1';

async function createZernioProfile(name) {
  try {
    console.log('[Zernio] Creating profile, API key set:', !!process.env.ZERNIO_API_KEY);
    const res = await fetch(`${ZERNIO}/profiles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `${name}'s Profile ${Date.now().toString(36)}` }),
    });
    const text = await res.text();
    console.log('[Zernio] Profile response status:', res.status, 'body:', text.slice(0, 200));
    const data = JSON.parse(text);
    return data.profile?._id || data._id || null;
  } catch (err) {
    console.error('[Zernio] Failed to create profile:', err.message);
    return null;
  }
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const zernioProfileId = await createZernioProfile(name);

    db.prepare(
      'INSERT INTO users (id, name, email, password_hash, zernio_profile_id) VALUES (?, ?, ?, ?, ?)'
    ).run(id, name, email, passwordHash, zernioProfileId);

    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user: { id, name, email, zernioProfileId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, zernioProfileId: user.zernio_profile_id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  const user = db
    .prepare('SELECT id, name, email, zernio_profile_id FROM users WHERE id = ?')
    .get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, zernioProfileId: user.zernio_profile_id } });
});

export default router;
