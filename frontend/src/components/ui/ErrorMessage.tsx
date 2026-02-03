import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title,
  message,
  onRetry,
}: ErrorMessageProps) {
  const { t } = useI18n();
  const resolvedTitle = title ?? t('common.errorTitle');
  const resolvedMessage = message ?? t('common.errorMessage');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-dark-100 mb-2">{resolvedTitle}</h3>
      <p className="text-dark-400 text-center max-w-md mb-6">{resolvedMessage}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary">
          <RefreshCw className="w-4 h-4" />
          {t('common.retry')}
        </button>
      )}
    </motion.div>
  );
}
