import db, { Media, Collection } from '../db/index.js';
import { nanoid } from 'nanoid';

// Generate a URL-safe ID (12 characters)
const generateId = () => nanoid(12);

export const mediaService = {
  /**
   * Create a new media entry
   */
  create(data: {
    cid: string;
    title: string;
    description?: string;
    media_type: Media['media_type'];
    mime_type: string;
    file_size?: number;
    thumbnail_cid?: string;
    tags?: string[];
    source_info?: string;
    lost_date?: string;
    found_date?: string;
    uploader_ip?: string;
  }): Media {
    const id = generateId();
    const tagsStr = data.tags?.join(',') || null;

    const stmt = db.prepare(`
      INSERT INTO media (id, cid, title, description, media_type, mime_type, file_size, thumbnail_cid, tags, source_info, lost_date, found_date, uploader_ip)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.cid,
      data.title,
      data.description || null,
      data.media_type,
      data.mime_type,
      data.file_size || null,
      data.thumbnail_cid || null,
      tagsStr,
      data.source_info || null,
      data.lost_date || null,
      data.found_date || null,
      data.uploader_ip || null
    );

    return this.getById(id)!;
  },

  /**
   * Get media by public ID (not CID)
   */
  getById(id: string): Media | undefined {
    const stmt = db.prepare('SELECT * FROM media WHERE id = ?');
    return stmt.get(id) as Media | undefined;
  },

  /**
   * Get CID by media ID (internal use only)
   */
  getCidById(id: string): string | undefined {
    const stmt = db.prepare('SELECT cid FROM media WHERE id = ?');
    const result = stmt.get(id) as { cid: string } | undefined;
    return result?.cid;
  },

  /**
   * Increment view count
   */
  incrementViewCount(id: string): void {
    const stmt = db.prepare('UPDATE media SET view_count = view_count + 1 WHERE id = ?');
    stmt.run(id);
  },

  /**
   * Get all public media with pagination
   */
  getPublicMedia(options: {
    page?: number;
    limit?: number;
    type?: Media['media_type'];
    search?: string;
    sortBy?: 'created_at' | 'view_count' | 'title';
    sortOrder?: 'asc' | 'desc';
  } = {}): { data: Omit<Media, 'cid' | 'uploader_ip'>[]; total: number; page: number; totalPages: number } {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 20, 100);
    const offset = (page - 1) * limit;
    const sortBy = options.sortBy || 'created_at';
    const sortOrder = options.sortOrder || 'desc';

    let whereClause = 'WHERE is_public = 1';
    const params: (string | number)[] = [];

    if (options.type) {
      whereClause += ' AND media_type = ?';
      params.push(options.type);
    }

    if (options.search) {
      whereClause += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const countStmt = db.prepare(`SELECT COUNT(*) as count FROM media ${whereClause}`);
    const { count } = countStmt.get(...params) as { count: number };

    // Get paginated results (excluding sensitive fields)
    const dataStmt = db.prepare(`
      SELECT id, title, description, media_type, mime_type, file_size, thumbnail_cid, tags, source_info, lost_date, found_date, created_at, updated_at, view_count, is_public
      FROM media 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `);

    const data = dataStmt.all(...params, limit, offset) as Omit<Media, 'cid' | 'uploader_ip'>[];

    return {
      data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  },

  /**
   * Get recent media
   */
  getRecent(limit: number = 10): Omit<Media, 'cid' | 'uploader_ip'>[] {
    const stmt = db.prepare(`
      SELECT id, title, description, media_type, mime_type, file_size, thumbnail_cid, tags, source_info, lost_date, found_date, created_at, updated_at, view_count, is_public
      FROM media 
      WHERE is_public = 1
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(limit) as Omit<Media, 'cid' | 'uploader_ip'>[];
  },

  /**
   * Get popular media
   */
  getPopular(limit: number = 10): Omit<Media, 'cid' | 'uploader_ip'>[] {
    const stmt = db.prepare(`
      SELECT id, title, description, media_type, mime_type, file_size, thumbnail_cid, tags, source_info, lost_date, found_date, created_at, updated_at, view_count, is_public
      FROM media 
      WHERE is_public = 1
      ORDER BY view_count DESC
      LIMIT ?
    `);
    return stmt.all(limit) as Omit<Media, 'cid' | 'uploader_ip'>[];
  },

  /**
   * Update media metadata
   */
  update(id: string, data: Partial<Pick<Media, 'title' | 'description' | 'tags' | 'source_info' | 'lost_date' | 'found_date' | 'is_public'>>): Media | undefined {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.tags !== undefined) {
      fields.push('tags = ?');
      values.push(data.tags);
    }
    if (data.source_info !== undefined) {
      fields.push('source_info = ?');
      values.push(data.source_info);
    }
    if (data.lost_date !== undefined) {
      fields.push('lost_date = ?');
      values.push(data.lost_date);
    }
    if (data.found_date !== undefined) {
      fields.push('found_date = ?');
      values.push(data.found_date);
    }
    if (data.is_public !== undefined) {
      fields.push('is_public = ?');
      values.push(data.is_public);
    }

    if (fields.length === 0) return this.getById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`UPDATE media SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getById(id);
  },

  /**
   * Delete media
   */
  delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM media WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  /**
   * Get statistics
   */
  getStats(): { totalMedia: number; totalViews: number; byType: Record<string, number> } {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM media WHERE is_public = 1');
    const { count: totalMedia } = totalStmt.get() as { count: number };

    const viewsStmt = db.prepare('SELECT SUM(view_count) as total FROM media WHERE is_public = 1');
    const { total: totalViews } = viewsStmt.get() as { total: number };

    const byTypeStmt = db.prepare('SELECT media_type, COUNT(*) as count FROM media WHERE is_public = 1 GROUP BY media_type');
    const byTypeRows = byTypeStmt.all() as { media_type: string; count: number }[];
    const byType: Record<string, number> = {};
    byTypeRows.forEach(row => {
      byType[row.media_type] = row.count;
    });

    return { totalMedia, totalViews: totalViews || 0, byType };
  },
};

export const collectionService = {
  create(data: { name: string; description?: string; cover_image_cid?: string }): Collection {
    const id = generateId();

    const stmt = db.prepare(`
      INSERT INTO collections (id, name, description, cover_image_cid)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, data.name, data.description || null, data.cover_image_cid || null);

    return this.getById(id)!;
  },

  getById(id: string): Collection | undefined {
    const stmt = db.prepare('SELECT * FROM collections WHERE id = ?');
    return stmt.get(id) as Collection | undefined;
  },

  getAll(): Collection[] {
    const stmt = db.prepare('SELECT * FROM collections ORDER BY created_at DESC');
    return stmt.all() as Collection[];
  },

  addMedia(collectionId: string, mediaId: string): void {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO collection_media (collection_id, media_id)
      VALUES (?, ?)
    `);
    stmt.run(collectionId, mediaId);
  },

  removeMedia(collectionId: string, mediaId: string): void {
    const stmt = db.prepare('DELETE FROM collection_media WHERE collection_id = ? AND media_id = ?');
    stmt.run(collectionId, mediaId);
  },

  getMediaInCollection(collectionId: string): Omit<Media, 'cid' | 'uploader_ip'>[] {
    const stmt = db.prepare(`
      SELECT m.id, m.title, m.description, m.media_type, m.mime_type, m.file_size, m.thumbnail_cid, m.tags, m.source_info, m.lost_date, m.found_date, m.created_at, m.updated_at, m.view_count, m.is_public
      FROM media m
      JOIN collection_media cm ON m.id = cm.media_id
      WHERE cm.collection_id = ? AND m.is_public = 1
      ORDER BY cm.added_at DESC
    `);
    return stmt.all(collectionId) as Omit<Media, 'cid' | 'uploader_ip'>[];
  },
};
