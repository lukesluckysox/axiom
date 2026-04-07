import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import path from 'path';

// ─── Schema ──────────────────────────────────────────────────────────────────

export const users = sqliteTable('users', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  username:     text('username').notNull().unique(),
  email:        text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt:    text('created_at').notNull(),
});

export type User = typeof users.$inferSelect;

// ─── Connection ───────────────────────────────────────────────────────────────

const dbPath = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? `${process.env.RAILWAY_VOLUME_MOUNT_PATH}/lumen.db`
  : path.resolve(process.cwd(), 'lumen.db');

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema: { users } });

// ─── Bootstrap ────────────────────────────────────────────────────────────────

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    username     TEXT NOT NULL UNIQUE,
    email        TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at   TEXT NOT NULL
  )
`);

console.log(`[db] Connected: ${dbPath}`);
