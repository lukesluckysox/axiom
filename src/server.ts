import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { authRouter } from './routes/auth';
import { epistemicRouter } from './routes/epistemic/index';
import { loopRouter } from './routes/loop';
import { cockpitRouter } from './routes/cockpit';
import { oracleRouter } from './routes/oracle';

// Initialise DB (creates tables on first run)
import './db';

const app  = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ─── Static assets ───────────────────────────────────────────────────────────
// In production, serve the Vite build output from dist/public
// Also serve the legacy public/ folder for favicon, manifest, etc.
const fs = require('fs');
const clientBuildPath = path.join(__dirname, 'public'); // dist/public after build
const legacyPublicPath = path.join(__dirname, '..', 'public');

const staticPath = fs.existsSync(clientBuildPath) ? clientBuildPath : legacyPublicPath;

app.use(express.static(staticPath, {
  setHeaders(res: any, filePath: string) {
    if (filePath.endsWith('index.html') || filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
}));
// Also serve legacy public assets (favicon, manifest, etc.)
if (staticPath !== legacyPublicPath && fs.existsSync(legacyPublicPath)) {
  app.use(express.static(legacyPublicPath));
}

// ─── API ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/epistemic', epistemicRouter);
app.use('/api/loop', loopRouter);
app.use('/api/cockpit', cockpitRouter);
app.use('/api/oracle', oracleRouter);

app.get('/api/health', (_, res) => {
  const volPath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
  const dbFile = volPath ? `${volPath}/lumen.db` : 'lumen.db (ephemeral)';
  const fs = require('fs');
  const dbExists = fs.existsSync(volPath ? `${volPath}/lumen.db` : require('path').resolve(process.cwd(), 'lumen.db'));
  const dbSize = dbExists ? (fs.statSync(volPath ? `${volPath}/lumen.db` : require('path').resolve(process.cwd(), 'lumen.db')).size / 1024).toFixed(1) + ' KB' : 'N/A';
  res.json({
    ok: true,
    service: 'lumen',
    persistence: {
      volumeMounted: !!volPath,
      volumePath: volPath ?? '(none)',
      dbFile,
      dbExists,
      dbSize,
    },
  });
});

// ─── Fallback — serve the React SPA shell for all non-API routes ─────────────
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  const indexPath = path.join(staticPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.sendFile(path.join(legacyPublicPath, 'index.html'));
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Lumen] Server running on port ${PORT}`);
});
