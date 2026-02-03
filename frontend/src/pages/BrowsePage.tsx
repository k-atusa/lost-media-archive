import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Play,
  Image as ImageIcon,
  Music,
  FileText,
  X,
} from 'lucide-react';
import { mediaApi } from '@/lib/api';
import MediaCard from '@/components/media/MediaCard';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { cn } from '@/lib/utils';
import type { Media } from '@/types';

const MEDIA_TYPES = [
  { value: undefined, label: '전체', icon: null },
  { value: 'video' as const, label: '영상', icon: Play },
  { value: 'image' as const, label: '이미지', icon: ImageIcon },
  { value: 'audio' as const, label: '오디오', icon: Music },
  { value: 'document' as const, label: '문서', icon: FileText },
];

const SORT_OPTIONS = [
  { value: 'created_at', label: '등록일순' },
  { value: 'view_count', label: '조회수순' },
  { value: 'title', label: '제목순' },
];

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const page = parseInt(searchParams.get('page') || '1');
  const type = searchParams.get('type') as Media['media_type'] | undefined;
  const search = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sortBy') || 'created_at') as 'created_at' | 'view_count' | 'title';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['media', 'browse', { page, type, search, sortBy, sortOrder }],
    queryFn: () =>
      mediaApi.getAll({
        page,
        limit: 20,
        type: type || undefined,
        search: search || undefined,
        sortBy,
        sortOrder,
      }),
  });

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 when filters change (except when changing page)
    if (!updates.page) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    updateParams({ search: searchValue });
  };

  const clearSearch = () => {
    updateParams({ search: undefined });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-dark-100 mb-2">아카이브 탐색</h1>
        <p className="text-dark-400">
          {data?.total || 0}개의 미디어가 보관되어 있습니다.
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-6"
      >
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="제목, 설명, 태그로 검색..."
            className="input pl-12 pr-20"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-1 hover:bg-dark-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-dark-400" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary py-2 px-4"
          >
            검색
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-dark-500" />
            {MEDIA_TYPES.map((mediaType) => (
              <button
                key={mediaType.label}
                onClick={() => updateParams({ type: mediaType.value })}
                className={cn(
                  'btn text-sm py-1.5 px-3',
                  type === mediaType.value || (!type && !mediaType.value)
                    ? 'btn-primary'
                    : 'btn-ghost'
                )}
              >
                {mediaType.icon && <mediaType.icon className="w-4 h-4" />}
                {mediaType.label}
              </button>
            ))}
          </div>

          {/* Sort & View */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => updateParams({ sortBy: e.target.value })}
              className="input py-2 px-3 text-sm w-auto"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => updateParams({ sortOrder: sortOrder === 'desc' ? 'asc' : 'desc' })}
              className="btn btn-ghost p-2"
              title={sortOrder === 'desc' ? '오름차순' : '내림차순'}
            >
              {sortOrder === 'desc' ? (
                <SortDesc className="w-5 h-5" />
              ) : (
                <SortAsc className="w-5 h-5" />
              )}
            </button>

            <div className="hidden sm:flex items-center border-l border-dark-700 pl-2 ml-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('btn btn-ghost p-2', viewMode === 'grid' && 'text-primary-400')}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('btn btn-ghost p-2', viewMode === 'list' && 'text-primary-400')}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Search */}
        {search && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-dark-400">검색어:</span>
            <span className="tag tag-primary">
              "{search}"
              <button onClick={clearSearch} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}
      </motion.div>

      {/* Results */}
      {isLoading ? (
        <div
          className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
          )}
        >
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <LoadingCard key={i} />
            ))}
        </div>
      ) : error ? (
        <ErrorMessage
          title="미디어 로드 실패"
          message="미디어 목록을 불러오는 데 실패했습니다."
          onRetry={refetch}
        />
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="검색 결과가 없습니다"
          message={
            search
              ? `"${search}"에 대한 검색 결과가 없습니다.`
              : '해당 조건에 맞는 미디어가 없습니다.'
          }
          actionLabel="필터 초기화"
          actionLink="/browse"
        />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'grid gap-6',
              viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
            )}
          >
            {data?.data.map((media, index) => (
              <MediaCard key={media.id} media={media} index={index} />
            ))}
          </motion.div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-2 mt-12"
            >
              <button
                onClick={() => updateParams({ page: String(page - 1) })}
                disabled={page === 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                이전
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (data.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= data.totalPages - 2) {
                    pageNum = data.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateParams({ page: String(pageNum) })}
                      className={cn(
                        'w-10 h-10 rounded-xl font-medium transition-all',
                        page === pageNum
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => updateParams({ page: String(page + 1) })}
                disabled={page === data.totalPages}
                className="btn btn-secondary disabled:opacity-50"
              >
                다음
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
