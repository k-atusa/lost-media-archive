import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} border-2 border-dark-600 border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function LoadingPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-dark-400">{t('common.loading')}</p>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="aspect-video bg-dark-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-dark-800 rounded w-3/4" />
        <div className="h-4 bg-dark-800 rounded w-full" />
        <div className="h-4 bg-dark-800 rounded w-2/3" />
      </div>
    </div>
  );
}
