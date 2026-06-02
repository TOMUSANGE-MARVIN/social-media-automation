import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import zernioRouter from './routes/zernio.js';
import aiRouter from './routes/ai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || '';

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true); // curl / server-to-server
        if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
        if (CLIENT_URL && origin === CLIENT_URL) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/zernio', zernioRouter);
app.use('/api/ai', aiRouter);
app.get('/api/health', (_, res) => res.json({ ok: true, ts: Date.now() }));

// Serve React build in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`[server] http://localhost:${PORT}`));
