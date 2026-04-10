import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db, users } from '../db';

const router = Router();

const JWT_SECRET  = process.env.JWT_SECRET || 'lumen-dev-secret-CHANGE-IN-PRODUCTION';
const COOKIE_NAME = 'lumen-session';
const OWNER_USERNAME = 'lukesluckysox';

const LUMEN_INTERNAL_TOKEN = process.env.LUMEN_INTERNAL_TOKEN || '';

const SUB_APPS = [
  { key: 'liminal',  label: 'Liminal',  url: process.env.LIMINAL_API_URL  || 'https://liminal-app.up.railway.app' },
  { key: 'parallax', label: 'Parallax', url: process.env.PARALLAX_API_URL || 'https://parallaxapp.up.railway.app' },
  { key: 'praxis',   label: 'Praxis',   url: process.env.PRAXIS_API_URL   || 'https://praxis-app.up.railway.app' },
  { key: 'axiom',    label: 'Axiom',    url: process.env.AXIOM_API_URL    || 'https://axiomtool-production.up.railway.app' },
];

interface AuthPayload { userId: number | string; username: string; }

function authenticate(req: Request): AuthPayload | null {
  const token = (req.cookies as Record<string, string>)?.[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch { return null; }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function pingHealth(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const r = await fetch(`${url}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (r.ok) return true;
    // Fallback: some apps use /health instead
    const r2 = await fetch(`${url}/health`, { signal: AbortSignal.timeout(3000) });
    return r2.ok;
  } catch { return false; }
}

async function fetchSubAppUsers(url: string): Promise<any[]> {
  if (!LUMEN_INTERNAL_TOKEN) return [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const r = await fetch(`${url}/api/internal/users`, {
      headers: {
        'x-lumen-internal-token': LUMEN_INTERNAL_TOKEN,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (r.ok) {
      const data = await r.json() as any;
      return data.users || data || [];
    }
    return [];
  } catch { return []; }
}

// ─── GET /api/oracle/users ──────────────────────────────────────────────────
// Owner-only: returns Lumen users, per-sub-app users, and health status

router.get('/users', async (req: Request, res: Response) => {
  const auth = authenticate(req);
  if (!auth) return res.status(401).json({ error: 'Not authenticated.' });

  if (auth.username !== OWNER_USERNAME) {
    return res.status(403).json({ error: 'Oracle access is owner-only.' });
  }

  try {
    // Get all Lumen users
    const allUsers = db.select({
      id:        users.id,
      username:  users.username,
      email:     users.email,
      createdAt: users.createdAt,
    }).from(users).all();

    // Parallel: ping health + fetch users for each sub-app
    const results = await Promise.all(SUB_APPS.map(async (app) => {
      const [online, appUsers] = await Promise.all([
        pingHealth(app.url),
        fetchSubAppUsers(app.url),
      ]);
      return { key: app.key, online, users: appUsers };
    }));

    // Build response shape the frontend expects
    const subAppStatus: Record<string, string> = {};
    const perApp: Record<string, any[]> = {};

    results.forEach(r => {
      subAppStatus[r.key] = r.online ? 'online' : 'offline';
      perApp[r.key] = r.users;
    });

    return res.json({
      lumen: allUsers.map(u => ({
        id:        u.id,
        username:  u.username,
        email:     u.email,
        createdAt: u.createdAt,
      })),
      subAppStatus,
      ...perApp,  // liminal: [...], parallax: [...], etc.
    });
  } catch (err) {
    console.error('[oracle]', err);
    return res.status(500).json({ error: 'Failed to load oracle data.' });
  }
});

export { router as oracleRouter };
