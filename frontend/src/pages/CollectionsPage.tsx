import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, Plus, Image as ImageIcon } from 'lucide-react';
import { collectionApi } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';

export default function CollectionsPage() {
  const { t } = useI18n();
  const { data: collections, isLoading, error, refetch } = useQuery({
    queryKey: ['collections'],
    queryFn: () => collectionApi.getAll(),
  });

  if (isLoading) return <LoadingPage />;
  if (error) {
    return (
      <ErrorMessage
        title={t('collections.loadErrorTitle')}
        message={t('collections.loadErrorMessage')}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-dark-100 mb-2">{t('collections.title')}</h1>
          <p className="text-dark-400">
            {t('collections.subtitle')}
          </p>
        </div>
      </motion.div>

      {/* Collections Grid */}
      {!collections || collections.length === 0 ? (
        <EmptyState
          title={t('collections.emptyTitle')}
          message={t('collections.emptyMessage')}
          actionLabel={t('collections.explore')}
          actionLink="/browse"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/collections/${collection.id}`}
                className="glass-card overflow-hidden card-hover block"
              >
                {/* Cover */}
                <div className="aspect-video bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                  {collection.cover_image_cid ? (
                    <img
                      src={`/api/media/${collection.cover_image_cid}/stream`}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FolderOpen className="w-16 h-16 text-dark-600" />
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-dark-100 mb-1">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-sm text-dark-400 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
