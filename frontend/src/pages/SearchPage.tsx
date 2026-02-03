import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Clock, TrendingUp, Tag } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const POPULAR_TAGS = [
  '광고', 'TV', '90년대', '2000년대', '게임', '애니메이션', 
  '음악', '영화', '방송사고', '뮤직비디오'
];

const RECENT_SEARCHES = [
  // This would typically come from localStorage
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { t } = useI18n();

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">{t('search.title')}</h1>
        <p className="text-dark-400">{t('search.subtitle')}</p>
      </motion.div>

      {/* Search Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="relative mb-12"
      >
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-dark-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full pl-16 pr-32 py-5 bg-dark-800/50 border-2 border-dark-700 rounded-2xl text-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
          autoFocus
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-primary py-3 px-6"
        >
          {t('common.search')}
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.form>

      {/* Popular Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          {t('search.popularTags')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSearch(tag)}
              className="tag tag-primary hover:bg-primary-500/20 transition-colors"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-dark-100 mb-4">{t('search.tipsTitle')}</h2>
        <ul className="space-y-3 text-dark-400 text-sm">
          {t('search.tips').split('||').map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
