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
import { useI18n } from '@/lib/i18n';

const SORT_OPTIONS = [
  { value: 'created_at', key: 'browse.sortByDate' },
  { value: 'view_count', key: 'browse.sortByViews' },
  { value: 'title', key: 'browse.sortByTitle' },
];

export default function BrowsePage() {
  const { t } = useI18n();
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
        <h1 className="text-3xl font-bold text-dark-100 mb-2">{t('browse.title')}</h1>
        <p className="text-dark-400">
          {data?.total || 0} {t('browse.total')}
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
            placeholder={t('common.searchPlaceholder')}
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
            {t('common.search')}
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-dark-500" />
            {[
              { value: undefined, label: t('browse.all'), icon: null },
              { value: 'video' as const, label: t('browse.video'), icon: Play },
              { value: 'image' as const, label: t('browse.image'), icon: ImageIcon },
              { value: 'audio' as const, label: t('browse.audio'), icon: Music },
              { value: 'document' as const, label: t('browse.document'), icon: FileText },
            ].map((mediaType) => (
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
                  {t(option.key)}
                </option>
              ))}
            </select>

            <button
              onClick={() => updateParams({ sortOrder: sortOrder === 'desc' ? 'asc' : 'desc' })}
              className="btn btn-ghost p-2"
              title={sortOrder === 'desc' ? t('browse.ascending') : t('browse.descending')}
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
            <span className="text-dark-400">{t('browse.searchLabel')}</span>
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
          title={t('browse.loadErrorTitle')}
          message={t('browse.loadErrorMessage')}
          onRetry={refetch}
        />
      ) : data?.data.length === 0 ? (
        <EmptyState
          title={t('browse.noResultsTitle')}
          message={
            search
              ? `"${search}" ${t('browse.noResultsSearch')}`
              : t('browse.noResultsMessage')
          }
          actionLabel={t('browse.resetFilters')}
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
                {t('common.previous')}
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
                {t('common.next')}
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
