import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/routes';
import { authMiddleware } from './src/server/auth';
import { getDb } from './src/server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());
  app.use(cookieParser());
  app.use(authMiddleware);

  // Initialize SQLite database on boot
  try {
    await getDb();
    console.log('[G.I.F.T.] Database initialized successfully.');
  } catch (err) {
    console.error('[G.I.F.T.] Database init failure:', err);
  }

  // API router
  app.use('/api', apiRouter);

  // Serve Vite app
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[G.I.F.T.] Vite dev middleware mounted.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[G.I.F.T. Platform] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[G.I.F.T.] Fatal startup error:', err);
  process.exit(1);
});
