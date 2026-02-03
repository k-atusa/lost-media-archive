import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Calendar, Play, Image as ImageIcon, Music, FileText } from 'lucide-react';
import type { Media } from '@/types';
import { formatRelativeTime, formatViewCount, formatBytes, parseTags, cn } from '@/lib/utils';
import { mediaApi } from '@/lib/api';

interface MediaCardProps {
  media: Media;
  index?: number;
}

const mediaTypeIcons = {
  video: Play,
  image: ImageIcon,
  audio: Music,
  document: FileText,
};

export default function MediaCard({ media, index = 0 }: MediaCardProps) {
  const Icon = mediaTypeIcons[media.media_type] || FileText;
  const tags = parseTags(media.tags);
  const isVideo = media.media_type === 'video';
  const isImage = media.media_type === 'image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/view/${media.id}`} className="block media-card group">
        {/* Thumbnail / Preview */}
        <div className="relative aspect-video bg-dark-800 overflow-hidden">
          {isImage && media.thumbnail_cid ? (
            <img
              src={mediaApi.getStreamUrl(media.id)}
              alt={media.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
              <div className="w-16 h-16 rounded-2xl bg-dark-700/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8 text-dark-400" />
              </div>
            </div>
          )}

          {/* Play overlay for videos */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-dark-950/40">
              <div className="w-16 h-16 rounded-full bg-primary-500/90 flex items-center justify-center shadow-lg shadow-primary-500/50">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
            </div>
          )}

          {/* Media type badge */}
          <div className="absolute top-3 left-3">
            <span className={cn(
              "tag",
              media.media_type === 'video' && "bg-red-500/20 text-red-400 border-red-500/30",
              media.media_type === 'image' && "bg-blue-500/20 text-blue-400 border-blue-500/30",
              media.media_type === 'audio' && "bg-green-500/20 text-green-400 border-green-500/30",
              media.media_type === 'document' && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            )}>
              <Icon className="w-3 h-3 mr-1" />
              {media.media_type === 'video' && '영상'}
              {media.media_type === 'image' && '이미지'}
              {media.media_type === 'audio' && '오디오'}
              {media.media_type === 'document' && '문서'}
            </span>
          </div>

          {/* File size */}
          {media.file_size && (
            <div className="absolute top-3 right-3">
              <span className="tag">{formatBytes(media.file_size)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-dark-100 group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
            {media.title}
          </h3>

          {media.description && (
            <p className="text-sm text-dark-400 line-clamp-2 mb-3">
              {media.description}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag text-xs">
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="tag text-xs">+{tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-dark-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatViewCount(media.view_count)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatRelativeTime(media.created_at)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
