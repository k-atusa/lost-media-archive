import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionLink?: string;
}

export default function EmptyState({
  title = '콘텐츠가 없습니다',
  message = '아직 등록된 미디어가 없습니다.',
  actionLabel = '업로드하기',
  actionLink = '/upload',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
        <FolderOpen className="w-10 h-10 text-dark-500" />
      </div>
      <h3 className="text-xl font-semibold text-dark-100 mb-2">{title}</h3>
      <p className="text-dark-400 text-center max-w-md mb-6">{message}</p>
      <Link to={actionLink} className="btn btn-primary">
        {actionLabel}
      </Link>
    </motion.div>
  );
}
