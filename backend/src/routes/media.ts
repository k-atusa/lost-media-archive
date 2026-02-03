import { Router, Request, Response } from 'express';
import { Readable } from 'stream';
import { uploadToIPFS, streamFromIPFS } from '../services/ipfs.js';
import { mediaService } from '../services/media.js';
import { Media } from '../db/index.js';

const router = Router();

const getParam = (param: string | string[] | undefined): string | undefined =>
  Array.isArray(param) ? param[0] : param;

// Allowed MIME types
const ALLOWED_MIME_TYPES: Record<string, Media['media_type']> = {
  // Videos
  'video/mp4': 'video',
  'video/webm': 'video',
  'video/ogg': 'video',
  'video/quicktime': 'video',
  'video/x-msvideo': 'video',
  'video/x-matroska': 'video',
  // Images
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',
  'image/bmp': 'image',
  // Audio
  'audio/mpeg': 'audio',
  'audio/ogg': 'audio',
  'audio/wav': 'audio',
  'audio/webm': 'audio',
  'audio/flac': 'audio',
  // Documents
  'application/pdf': 'document',
};

/**
 * POST /api/media/upload
 * Upload media directly to IPFS using pipe (no server storage)
 */
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const contentType = req.headers['content-type']?.split(';')[0] || '';
    const mediaType = ALLOWED_MIME_TYPES[contentType];

    if (!mediaType) {
      res.status(400).json({
        error: 'Unsupported file type',
        allowedTypes: Object.keys(ALLOWED_MIME_TYPES),
      });
      return;
    }

    // Get metadata from headers
    const title = decodeURIComponent(req.headers['x-media-title'] as string || 'Untitled');
    const description = req.headers['x-media-description']
      ? decodeURIComponent(req.headers['x-media-description'] as string)
      : undefined;
    const tags = req.headers['x-media-tags']
      ? decodeURIComponent(req.headers['x-media-tags'] as string).split(',')
      : undefined;
    const sourceInfo = req.headers['x-media-source']
      ? decodeURIComponent(req.headers['x-media-source'] as string)
      : undefined;
    const lostDate = req.headers['x-media-lost-date'] as string | undefined;
    const foundDate = req.headers['x-media-found-date'] as string | undefined;

    // Track file size
    let fileSize = 0;
    const sizeTracker = new Readable({
      read() {},
    });

    req.on('data', (chunk: Buffer) => {
      fileSize += chunk.length;
      sizeTracker.push(chunk);
    });

    req.on('end', () => {
      sizeTracker.push(null);
    });

    req.on('error', (err) => {
      sizeTracker.destroy(err);
    });

    // Pipe directly to IPFS (no file storage on server!)
    const { cid } = await uploadToIPFS(sizeTracker);

    // Get client IP (for rate limiting purposes, not shown publicly)
    const uploaderIp = req.ip || req.socket.remoteAddress || 'unknown';

    // Create database entry with mapped ID
    const media = mediaService.create({
      cid,
      title,
      description,
      media_type: mediaType,
      mime_type: contentType,
      file_size: fileSize,
      tags,
      source_info: sourceInfo,
      lost_date: lostDate,
      found_date: foundDate,
      uploader_ip: uploaderIp,
    });

    // Return public ID (NOT the CID!)
    res.status(201).json({
      success: true,
      id: media.id,
      title: media.title,
      media_type: media.media_type,
      file_size: fileSize,
      created_at: media.created_at,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/media
 * Get paginated list of public media
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as Media['media_type'] | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as 'created_at' | 'view_count' | 'title' | undefined;
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' | undefined;

    const result = mediaService.getPublicMedia({
      page,
      limit,
      type,
      search,
      sortBy,
      sortOrder,
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

/**
 * GET /api/media/recent
 * Get recent media
 */
router.get('/recent', (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const media = mediaService.getRecent(limit);
    res.json(media);
  } catch (error) {
    console.error('Error fetching recent media:', error);
    res.status(500).json({ error: 'Failed to fetch recent media' });
  }
});

/**
 * GET /api/media/popular
 * Get popular media
 */
router.get('/popular', (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const media = mediaService.getPopular(limit);
    res.json(media);
  } catch (error) {
    console.error('Error fetching popular media:', error);
    res.status(500).json({ error: 'Failed to fetch popular media' });
  }
});

/**
 * GET /api/media/stats
 * Get archive statistics
 */
router.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = mediaService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * GET /api/media/:id
 * Get media metadata by public ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Media ID is required' });
      return;
    }

    const media = mediaService.getById(id);

    if (!media || !media.is_public) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    // Increment view count
    mediaService.incrementViewCount(id);

    // Return metadata WITHOUT CID
    const { cid, uploader_ip, ...publicMedia } = media;
    res.json(publicMedia);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

/**
 * GET /api/media/:id/stream
 * Stream media content from IPFS (CID hidden from client)
 */
router.get('/:id/stream', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Media ID is required' });
      return;
    }

    const media = mediaService.getById(id);

    if (!media || !media.is_public) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    // Set appropriate headers
    res.setHeader('Content-Type', media.mime_type);
    if (media.file_size) {
      res.setHeader('Content-Length', media.file_size);
    }
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year (immutable content)

    // Stream from IPFS using the hidden CID
    const stream = streamFromIPFS(media.cid);

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream media' });
      }
    });

    stream.pipe(res);
  } catch (error) {
    console.error('Error streaming media:', error);
    res.status(500).json({ error: 'Failed to stream media' });
  }
});

/**
 * PATCH /api/media/:id
 * Update media metadata
 */
router.patch('/:id', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Media ID is required' });
      return;
    }

    const media = mediaService.getById(id);

    if (!media) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    const updated = mediaService.update(id, {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      source_info: req.body.source_info,
      lost_date: req.body.lost_date,
      found_date: req.body.found_date,
    });

    if (updated) {
      const { cid, uploader_ip, ...publicMedia } = updated;
      res.json(publicMedia);
    } else {
      res.status(404).json({ error: 'Media not found' });
    }
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ error: 'Failed to update media' });
  }
});

/**
 * DELETE /api/media/:id
 * Delete media (metadata only, IPFS content persists)
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Media ID is required' });
      return;
    }

    const deleted = mediaService.delete(id);

    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Media not found' });
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;
