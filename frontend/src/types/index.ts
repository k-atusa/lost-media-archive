export interface Media {
  id: string;
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
  media?: Media[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UploadResponse {
  success: boolean;
  id: string;
  title: string;
  media_type: string;
  file_size: number;
  created_at: string;
}

export interface Stats {
  totalMedia: number;
  totalViews: number;
  byType: Record<string, number>;
}
