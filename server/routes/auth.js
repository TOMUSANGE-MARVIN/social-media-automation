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
    const res = await fetch(`${ZERNIO}/profiles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `${name}'s Profile ${Date.now().toString(36)}` }),
    });
    const data = await res.json();
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

    const existing = await db('users').where({ email }).first('id', 'google_id', 'password_hash');
    if (existing) {
      if (existing.google_id && !existing.password_hash) {
        return res.status(409).json({ error: 'This email is linked to a Google account. Please continue with Google to sign in.' });
      }
      return res.status(409).json({ error: 'Email already registered. Please sign in instead.' });
    }

    const id             = randomUUID();
    const passwordHash   = await bcrypt.hash(password, 10);
    const zernioProfileId = await createZernioProfile(name);

    await db('users').insert({ id, name, email, password_hash: passwordHash, zernio_profile_id: zernioProfileId });

    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({
      token,
      user: { id, name, email, zernioProfileId, isAdmin: false, plan: 'free', paidAccountSlots: 0 },
    });
  } catch (err) {
    console.error('[auth/register]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.password_hash) {
      return res.status(401).json({ error: 'This account uses Google sign-in. Please continue with Google to log in.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      token,
      user: {
        id:               user.id,
        name:             user.name,
        email:            user.email,
        zernioProfileId:  user.zernio_profile_id,
        isAdmin:          !!user.is_admin,
        plan:             user.plan || 'free',
        paidAccountSlots: user.paid_account_slots || 0,
      },
    });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/google  — verify Google access token via userinfo endpoint
router.post('/google', async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) return res.status(400).json({ error: 'Missing access_token' });

    const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!infoRes.ok) return res.status(401).json({ error: 'Invalid Google token' });
    const { sub: googleId, email, name, picture } = await infoRes.json();

    // Find existing user by google_id or email
    let user = await db('users').where({ google_id: googleId }).first();
    if (!user) user = await db('users').where({ email }).first();

    if (!user) {
      // New user — create account
      const id = randomUUID();
      const zernioProfileId = await createZernioProfile(name);
      await db('users').insert({
        id, name, email,
        google_id:        googleId,
        avatar_url:       picture || null,
        zernio_profile_id: zernioProfileId,
      });
      user = await db('users').where({ id }).first();
    } else if (!user.google_id) {
      // Existing email account — link Google
      await db('users').where({ id: user.id }).update({ google_id: googleId, avatar_url: picture || null });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      token,
      user: {
        id:               user.id,
        name:             user.name,
        email:            user.email,
        zernioProfileId:  user.zernio_profile_id,
        isAdmin:          !!user.is_admin,
        plan:             user.plan || 'free',
        paidAccountSlots: user.paid_account_slots || 0,
      },
    });
  } catch (err) {
    console.error('[auth/google]', err);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.userId })
      .first('id', 'name', 'email', 'zernio_profile_id', 'is_admin', 'plan', 'paid_account_slots');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      user: {
        id:               user.id,
        name:             user.name,
        email:            user.email,
        zernioProfileId:  user.zernio_profile_id,
        isAdmin:          !!user.is_admin,
        plan:             user.plan || 'free',
        paidAccountSlots: user.paid_account_slots || 0,
      },
    });
  } catch (err) {
    console.error('[auth/me]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
