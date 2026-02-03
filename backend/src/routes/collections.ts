import { Router, Request, Response } from 'express';
import { collectionService, mediaService } from '../services/media.js';

const router = Router();

const getParam = (param: string | string[] | undefined): string | null => {
  if (!param) {
    return null;
  }

  return Array.isArray(param) ? param[0] : param;
};

/**
 * GET /api/collections
 * Get all collections
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const collections = collectionService.getAll();
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

/**
 * POST /api/collections
 * Create a new collection
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, description, cover_image_cid } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Collection name is required' });
      return;
    }

    const collection = collectionService.create({
      name,
      description,
      cover_image_cid,
    });

    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

/**
 * GET /api/collections/:id
 * Get collection by ID with its media
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Collection ID is required' });
      return;
    }

    const collection = collectionService.getById(id);

    if (!collection) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    const media = collectionService.getMediaInCollection(id);

    res.json({
      ...collection,
      media,
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

/**
 * POST /api/collections/:id/media
 * Add media to collection
 */
router.post('/:id/media', (req: Request, res: Response) => {
  try {
    const { mediaId } = req.body;
    const id = getParam(req.params.id);

    if (!id) {
      res.status(400).json({ error: 'Collection ID is required' });
      return;
    }

    if (!mediaId) {
      res.status(400).json({ error: 'Media ID is required' });
      return;
    }

    const collection = collectionService.getById(id);
    if (!collection) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    const media = mediaService.getById(mediaId);
    if (!media) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    collectionService.addMedia(id, mediaId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding media to collection:', error);
    res.status(500).json({ error: 'Failed to add media to collection' });
  }
});

/**
 * DELETE /api/collections/:id/media/:mediaId
 * Remove media from collection
 */
router.delete('/:id/media/:mediaId', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const mediaId = getParam(req.params.mediaId);

    if (!id || !mediaId) {
      res.status(400).json({ error: 'Collection ID and Media ID are required' });
      return;
    }

    collectionService.removeMedia(id, mediaId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing media from collection:', error);
    res.status(500).json({ error: 'Failed to remove media from collection' });
  }
});

export default router;
