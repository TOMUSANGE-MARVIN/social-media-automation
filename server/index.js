import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import db from './db.js';
import authRouter from './routes/auth.js';
import zernioRouter from './routes/zernio.js';
import aiRouter from './routes/ai.js';
import adminRouter from './routes/admin.js';
import storageRouter from './routes/storage.js';
import scheduledDeletionsRouter from './routes/scheduledDeletions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || '';

// Run pending migrations before accepting traffic
const migrationsDir = path.join(__dirname, 'migrations');
await db.migrate.latest({ directory: migrationsDir });
console.log('[db] migrations up to date');

// Strict CORS for API routes only
const apiCors = cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    if (CLIENT_URL && origin === CLIENT_URL) return cb(null, true);
    if (/\.207\.180\.249\.87\.sslip\.io$/.test(origin)) return cb(null, true);
    if (/\.mutindoexpress\.com$/.test(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
});

app.use(cors());
app.use(express.json());

app.use('/api/auth',            apiCors, authRouter);
app.use('/api/zernio',         apiCors, zernioRouter);
app.use('/api/ai',             apiCors, aiRouter);
app.use('/api/admin',          apiCors, adminRouter);
app.use('/api/storage',        apiCors, storageRouter);
app.use('/api/schedule-delete',apiCors, scheduledDeletionsRouter);
app.get('/api/health',         apiCors, (_, res) => res.json({ ok: true, ts: Date.now() }));

// Cron: execute scheduled post deletions every minute
const ZERNIO = 'https://zernio.com/api/v1';
cron.schedule('* * * * *', async () => {
  try {
    const due = await db('scheduled_deletions')
      .where('delete_at', '<=', new Date())
      .where('executed', false)
      .limit(50);

    for (const item of due) {
      try {
        await fetch(`${ZERNIO}/posts/${item.post_id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${process.env.ZERNIO_API_KEY}` },
        });
      } catch (err) {
        console.error('[cron/delete] Zernio error:', err.message);
      }
      await db('scheduled_deletions').where({ id: item.id }).update({ executed: true });
    }

    if (due.length > 0) console.log(`[cron/delete] Executed ${due.length} scheduled deletion(s)`);
  } catch (err) {
    console.error('[cron/delete]', err.message);
  }
});

// Serve React build in production
const distPath   = path.join(__dirname, '..', 'dist');
const assetsPath = path.join(distPath, 'assets');

app.get(/^\/assets\/index-.*\.(css|js)$/, (req, res) => {
  const requested = path.join(distPath, req.path);
  if (requested.startsWith(assetsPath) && fs.existsSync(requested)) {
    return res.sendFile(requested);
  }
  const ext      = req.path.endsWith('.css') ? '.css' : '.js';
  const fallback = fs.readdirSync(assetsPath).find((n) => n.startsWith('index-') && n.endsWith(ext));
  return fallback ? res.sendFile(path.join(assetsPath, fallback)) : res.status(404).end();
});

app.use(express.static(distPath));
app.use((req, res) => {
  if (path.extname(req.path)) return res.status(404).end();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`[server] http://localhost:${PORT}`));
