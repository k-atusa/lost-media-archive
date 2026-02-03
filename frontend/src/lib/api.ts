import axios from 'axios';
import type { Media, Collection, PaginatedResponse, UploadResponse, Stats } from '@/types';

const api = axios.create({
  baseURL: '/api',
});

export interface UploadOptions {
  file: File;
  title: string;
  description?: string;
  tags?: string[];
  sourceInfo?: string;
  lostDate?: string;
  foundDate?: string;
  onProgress?: (progress: number) => void;
}

export const mediaApi = {
  /**
   * Upload media to IPFS via server pipe
   */
  async upload(options: UploadOptions): Promise<UploadResponse> {
    const { file, title, description, tags, sourceInfo, lostDate, foundDate, onProgress } = options;

    const response = await api.post<UploadResponse>('/media/upload', file, {
      headers: {
        'Content-Type': file.type,
        'X-Media-Title': encodeURIComponent(title),
        ...(description && { 'X-Media-Description': encodeURIComponent(description) }),
        ...(tags?.length && { 'X-Media-Tags': encodeURIComponent(tags.join(',')) }),
        ...(sourceInfo && { 'X-Media-Source': encodeURIComponent(sourceInfo) }),
        ...(lostDate && { 'X-Media-Lost-Date': lostDate }),
        ...(foundDate && { 'X-Media-Found-Date': foundDate }),
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  /**
   * Get paginated media list
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    type?: Media['media_type'];
    search?: string;
    sortBy?: 'created_at' | 'view_count' | 'title';
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Media>> {
    const response = await api.get<PaginatedResponse<Media>>('/media', { params });
    return response.data;
  },

  /**
   * Get media by ID
   */
  async getById(id: string): Promise<Media> {
    const response = await api.get<Media>(`/media/${id}`);
    return response.data;
  },

  /**
   * Get recent media
   */
  async getRecent(limit?: number): Promise<Media[]> {
    const response = await api.get<Media[]>('/media/recent', { params: { limit } });
    return response.data;
  },

  /**
   * Get popular media
   */
  async getPopular(limit?: number): Promise<Media[]> {
    const response = await api.get<Media[]>('/media/popular', { params: { limit } });
    return response.data;
  },

  /**
   * Get archive statistics
   */
  async getStats(): Promise<Stats> {
    const response = await api.get<Stats>('/media/stats');
    return response.data;
  },

  /**
   * Update media metadata
   */
  async update(id: string, data: Partial<Media>): Promise<Media> {
    const response = await api.patch<Media>(`/media/${id}`, data);
    return response.data;
  },

  /**
   * Delete media
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/media/${id}`);
  },

  /**
   * Get stream URL for media
   */
  getStreamUrl(id: string): string {
    return `/api/media/${id}/stream`;
  },
};

export const collectionApi = {
  /**
   * Get all collections
   */
  async getAll(): Promise<Collection[]> {
    const response = await api.get<Collection[]>('/collections');
    return response.data;
  },

  /**
   * Get collection by ID
   */
  async getById(id: string): Promise<Collection> {
    const response = await api.get<Collection>(`/collections/${id}`);
    return response.data;
  },

  /**
   * Create collection
   */
  async create(data: { name: string; description?: string }): Promise<Collection> {
    const response = await api.post<Collection>('/collections', data);
    return response.data;
  },

  /**
   * Add media to collection
   */
  async addMedia(collectionId: string, mediaId: string): Promise<void> {
    await api.post(`/collections/${collectionId}/media`, { mediaId });
  },

  /**
   * Remove media from collection
   */
  async removeMedia(collectionId: string, mediaId: string): Promise<void> {
    await api.delete(`/collections/${collectionId}/media/${mediaId}`);
  },
};

export const healthApi = {
  async check(): Promise<{ status: string; ipfs: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  },
};
