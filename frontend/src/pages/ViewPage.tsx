import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Download,
  Share2,
  Tag,
  Info,
  Clock,
  FileText,
  Play,
  Image as ImageIcon,
  Music,
} from 'lucide-react';
import { mediaApi } from '@/lib/api';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { formatBytes, formatDate, formatRelativeTime, formatViewCount, parseTags, cn } from '@/lib/utils';

export default function ViewPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: media,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['media', id],
    queryFn: () => mediaApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingPage />;
  if (error || !media) {
    return (
      <ErrorMessage
        title="미디어를 찾을 수 없습니다"
        message="요청하신 미디어가 존재하지 않거나 접근이 제한되었습니다."
        onRetry={refetch}
      />
    );
  }

  const streamUrl = mediaApi.getStreamUrl(media.id);
  const tags = parseTags(media.tags);
  const isVideo = media.media_type === 'video';
  const isImage = media.media_type === 'image';
  const isAudio = media.media_type === 'audio';

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: media.title,
          text: media.description || `Lost Media Archive: ${media.title}`,
          url,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>목록으로</span>
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Media Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
          >
            {isVideo && (
              <div className="video-player-wrapper">
                <video
                  src={streamUrl}
                  className="w-full h-full"
                  controls
                  controlsList="nodownload"
                />
              </div>
            )}

            {isImage && (
              <div className="relative bg-dark-900 flex items-center justify-center min-h-[400px]">
                <img
                  src={streamUrl}
                  alt={media.title}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            )}

            {isAudio && (
              <div className="p-8 bg-gradient-to-br from-dark-800 to-dark-900">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <Music className="w-16 h-16 text-green-500" />
                </div>
                <audio
                  src={streamUrl}
                  controls
                  className="w-full"
                />
              </div>
            )}

            {media.media_type === 'document' && (
              <div className="p-8 text-center">
                <div className="w-24 h-24 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-yellow-500" />
                </div>
                <p className="text-dark-400 mb-4">문서 미리보기를 지원하지 않습니다.</p>
                <a
                  href={streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <Download className="w-4 h-4" />
                  문서 열기
                </a>
              </div>
            )}
          </motion.div>

          {/* Title & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-start justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-100 mb-2">
                {media.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  조회수 {formatViewCount(media.view_count)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatRelativeTime(media.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="btn btn-secondary">
                <Share2 className="w-4 h-4" />
                공유
              </button>
            </div>
          </motion.div>

          {/* Description */}
          {media.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-dark-100 mb-3">설명</h2>
              <p className="text-dark-300 whitespace-pre-wrap leading-relaxed">
                {media.description}
              </p>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Info Card */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-400" />
              미디어 정보
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-dark-800">
                <span className="text-dark-400">유형</span>
                <span className={cn(
                  "tag",
                  media.media_type === 'video' && "bg-red-500/20 text-red-400 border-red-500/30",
                  media.media_type === 'image' && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                  media.media_type === 'audio' && "bg-green-500/20 text-green-400 border-green-500/30",
                  media.media_type === 'document' && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                )}>
                  {media.media_type === 'video' && <Play className="w-3 h-3 mr-1" />}
                  {media.media_type === 'image' && <ImageIcon className="w-3 h-3 mr-1" />}
                  {media.media_type === 'audio' && <Music className="w-3 h-3 mr-1" />}
                  {media.media_type === 'document' && <FileText className="w-3 h-3 mr-1" />}
                  {media.media_type === 'video' && '영상'}
                  {media.media_type === 'image' && '이미지'}
                  {media.media_type === 'audio' && '오디오'}
                  {media.media_type === 'document' && '문서'}
                </span>
              </div>

              {media.file_size && (
                <div className="flex justify-between items-center py-2 border-b border-dark-800">
                  <span className="text-dark-400">파일 크기</span>
                  <span className="text-dark-200">{formatBytes(media.file_size)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-dark-800">
                <span className="text-dark-400">MIME 타입</span>
                <span className="text-dark-200 text-sm font-mono">{media.mime_type}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dark-800">
                <span className="text-dark-400">등록일</span>
                <span className="text-dark-200">{formatDate(media.created_at)}</span>
              </div>

              {media.lost_date && (
                <div className="flex justify-between items-center py-2 border-b border-dark-800">
                  <span className="text-dark-400">유실 추정일</span>
                  <span className="text-dark-200">{formatDate(media.lost_date)}</span>
                </div>
              )}

              {media.found_date && (
                <div className="flex justify-between items-center py-2 border-b border-dark-800">
                  <span className="text-dark-400">발견일</span>
                  <span className="text-dark-200">{formatDate(media.found_date)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Source Info */}
          {media.source_info && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-dark-100 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-400" />
                출처 정보
              </h2>
              <p className="text-dark-300 text-sm">{media.source_info}</p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary-400" />
                태그
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/browse?search=${encodeURIComponent(tag)}`}
                    className="tag tag-primary hover:bg-primary-500/20 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* IPFS Info */}
          <div className="glass-card p-6 bg-gradient-to-br from-primary-500/5 to-purple-500/5">
            <h2 className="text-lg font-semibold text-dark-100 mb-3">🔐 분산 저장</h2>
            <p className="text-dark-400 text-sm leading-relaxed">
              이 콘텐츠는 IPFS 네트워크에 분산 저장되어 있습니다.
              CID(콘텐츠 주소)는 보안을 위해 공개되지 않습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
