import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Image as ImageIcon, Music, TrendingUp, Clock, Upload, Shield, Globe, Zap } from 'lucide-react';
import { mediaApi } from '@/lib/api';
import MediaCard from '@/components/media/MediaCard';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import { formatViewCount } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export default function HomePage() {
  const { t } = useI18n();
  const { data: recentMedia, isLoading: loadingRecent } = useQuery({
    queryKey: ['media', 'recent'],
    queryFn: () => mediaApi.getRecent(8),
  });

  const { data: popularMedia, isLoading: loadingPopular } = useQuery({
    queryKey: ['media', 'popular'],
    queryFn: () => mediaApi.getPopular(4),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => mediaApi.getStats(),
  });

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Fluid animation background */}
        <div className="fluid-bg">
          <div className="fluid-blob fluid-blob-1" />
          <div className="fluid-blob fluid-blob-2" />
          <div className="fluid-blob fluid-blob-3" />
          <div className="fluid-blob fluid-blob-4" />
        </div>
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-dark-950/60 z-[1]" />

        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              {t('home.badge')}
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-dark-100">{t('home.title1')}</span>
              <br />
              <span className="gradient-text">{t('home.title2')}</span>
            </h1>

            <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('home.subtitle').split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx === 0 && <br className="hidden sm:block" />}
                </span>
              ))}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/browse" className="btn btn-primary px-8 py-3 text-lg">
                {t('home.explore')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/upload" className="btn btn-secondary px-8 py-3 text-lg">
                <Upload className="w-5 h-5" />
                {t('home.contribute')}
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="glass-card p-6">
                <div className="text-3xl font-bold gradient-text">{stats.totalMedia}</div>
                <div className="text-dark-400 text-sm">{t('home.statsTotal')}</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-3xl font-bold text-dark-100">{formatViewCount(stats.totalViews)}</div>
                <div className="text-dark-400 text-sm">{t('home.statsViews')}</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-3xl font-bold text-dark-100">{stats.byType?.video || 0}</div>
                <div className="text-dark-400 text-sm">{t('home.statsVideo')}</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-3xl font-bold text-dark-100">{stats.byType?.image || 0}</div>
                <div className="text-dark-400 text-sm">{t('home.statsImage')}</div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mb-4">
              {t('home.whyTitle')}
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              {t('home.whySubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: t('home.features.distributed.title'),
                description: t('home.features.distributed.desc'),
              },
              {
                icon: Shield,
                title: t('home.features.censorship.title'),
                description: t('home.features.censorship.desc'),
              },
              {
                icon: Zap,
                title: t('home.features.privacy.title'),
                description: t('home.features.privacy.desc'),
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-dark-100 mb-3">{feature.title}</h3>
                <p className="text-dark-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Media */}
      {popularMedia && popularMedia.length > 0 && (
        <section className="py-20 bg-dark-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-dark-100">{t('home.popular')}</h2>
              </div>
              <Link to="/browse?sortBy=view_count" className="btn btn-ghost text-sm">
                {t('common.viewAll')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loadingPopular
                ? Array(4).fill(0).map((_, i) => <LoadingCard key={i} />)
                : popularMedia.map((media, index) => (
                    <MediaCard key={media.id} media={media} index={index} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Media */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-dark-100">{t('home.recent')}</h2>
            </div>
            <Link to="/browse" className="btn btn-ghost text-sm">
              {t('common.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingRecent
              ? Array(8).fill(0).map((_, i) => <LoadingCard key={i} />)
              : recentMedia?.map((media, index) => (
                  <MediaCard key={media.id} media={media} index={index} />
                ))}
          </div>

          {(!recentMedia || recentMedia.length === 0) && !loadingRecent && (
            <div className="text-center py-16">
              <p className="text-dark-400 mb-6">{t('home.noMedia')}</p>
              <Link to="/upload" className="btn btn-primary">
                {t('home.uploadFirst')}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Media Types */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-dark-100 mb-4">{t('home.categoryTitle')}</h2>
            <p className="text-dark-400">{t('home.categorySubtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'video', icon: Play, label: t('media.video'), color: 'from-red-500 to-pink-500', count: stats?.byType?.video },
              { type: 'image', icon: ImageIcon, label: t('media.image'), color: 'from-blue-500 to-cyan-500', count: stats?.byType?.image },
              { type: 'audio', icon: Music, label: t('media.audio'), color: 'from-green-500 to-emerald-500', count: stats?.byType?.audio },
              { type: 'document', icon: Play, label: t('media.document'), color: 'from-yellow-500 to-orange-500', count: stats?.byType?.document },
            ].map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/browse?type=${item.type}`}
                  className="glass-card p-6 flex items-center gap-4 card-hover block"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-100">{item.label}</h3>
                    <p className="text-dark-500 text-sm">{item.count || 0}{t('home.categoryCount')}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mb-4">
                {t('home.ctaTitle')}
              </h2>
              <p className="text-dark-400 max-w-2xl mx-auto mb-8">
                {t('home.ctaSubtitle').split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx === 0 && <br />}
                  </span>
                ))}
              </p>
              <Link to="/upload" className="btn btn-primary px-8 py-3 text-lg">
                <Upload className="w-5 h-5" />
                {t('home.ctaButton')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
