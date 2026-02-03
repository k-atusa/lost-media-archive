import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || './data/media.db';

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db: InstanceType<typeof Database> = new Database(DB_PATH);

// Disable WAL mode to avoid -wal/-shm files
db.pragma('journal_mode = DELETE');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    cid TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('video', 'image', 'audio', 'document')),
    mime_type TEXT NOT NULL,
    file_size INTEGER,
    thumbnail_cid TEXT,
    tags TEXT,
    source_info TEXT,
    lost_date TEXT,
    found_date TEXT,
    uploader_ip TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    view_count INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 1
  );

  CREATE INDEX IF NOT EXISTS idx_media_type ON media(media_type);
  CREATE INDEX IF NOT EXISTS idx_created_at ON media(created_at);
  CREATE INDEX IF NOT EXISTS idx_is_public ON media(is_public);

  CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cover_image_cid TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS collection_media (
    collection_id TEXT NOT NULL,
    media_id TEXT NOT NULL,
    added_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (collection_id, media_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
  );
`);

export default db;

export interface Media {
  id: string;
  cid: string;
  title: string;
  description?: string;
  media_type: 'video' | 'image' | 'audio' | 'document';
  mime_type: string;
  file_size?: number;
  thumbnail_cid?: string;
  tags?: string;
  source_info?: string;
  lost_date?: string;
  found_date?: string;
  uploader_ip?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  is_public: number;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  cover_image_cid?: string;
  created_at: string;
  updated_at: string;
}
