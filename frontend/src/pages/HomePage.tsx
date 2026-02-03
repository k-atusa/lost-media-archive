import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Image as ImageIcon, Music, TrendingUp, Clock, Upload, Shield, Globe, Zap } from 'lucide-react';
import { mediaApi } from '@/lib/api';
import MediaCard from '@/components/media/MediaCard';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import { formatViewCount } from '@/lib/utils';

export default function HomePage() {
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
              IPFS 기반 분산 저장소
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-dark-100">잊혀진 미디어를</span>
              <br />
              <span className="gradient-text">영원히 보존합니다</span>
            </h1>

            <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Lost Media Archive는 사라진 영상, 이미지, 오디오를
              <br className="hidden sm:block" />
              분산 네트워크에 영구적으로 보존하는 아카이브입니다.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/browse" className="btn btn-primary px-8 py-3 text-lg">
                아카이브 탐색
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/upload" className="btn btn-secondary px-8 py-3 text-lg">
                <Upload className="w-5 h-5" />
                미디어 기여하기
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
                <div className="text-dark-400 text-sm">총 미디어</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-3xl font-bold text-dark-100">{formatViewCount(stats.totalViews)}</div>
                <div className="text-dark-400 text-sm">총 조회수</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-3xl font-bold text-dark-100">{stats.byType?.video || 0}</div>
                <div className="text-dark-400 text-sm">영상</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-3xl font-bold text-dark-100">{stats.byType?.image || 0}</div>
                <div className="text-dark-400 text-sm">이미지</div>
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
              왜 Lost Media Archive인가?
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              기존 플랫폼과 달리 분산 저장 방식으로 검열에 강하고 영구적인 보존이 가능합니다.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: '분산 저장',
                description: 'IPFS 네트워크를 통해 전 세계에 분산 저장되어 단일 장애점이 없습니다.',
              },
              {
                icon: Shield,
                title: '검열 저항',
                description: '중앙 서버가 없어 특정 주체에 의한 삭제나 검열이 불가능합니다.',
              },
              {
                icon: Zap,
                title: '개인정보 보호',
                description: 'CID를 숨기고 내부 ID만 노출하여 콘텐츠 추적을 방지합니다.',
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
                <h2 className="text-2xl font-bold text-dark-100">인기 콘텐츠</h2>
              </div>
              <Link to="/browse?sortBy=view_count" className="btn btn-ghost text-sm">
                전체보기
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
              <h2 className="text-2xl font-bold text-dark-100">최근 추가</h2>
            </div>
            <Link to="/browse" className="btn btn-ghost text-sm">
              전체보기
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
              <p className="text-dark-400 mb-6">아직 등록된 미디어가 없습니다.</p>
              <Link to="/upload" className="btn btn-primary">
                첫 번째 미디어 업로드하기
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
            <h2 className="text-3xl font-bold text-dark-100 mb-4">카테고리별 탐색</h2>
            <p className="text-dark-400">원하는 미디어 유형을 선택하여 탐색하세요.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'video', icon: Play, label: '영상', color: 'from-red-500 to-pink-500', count: stats?.byType?.video },
              { type: 'image', icon: ImageIcon, label: '이미지', color: 'from-blue-500 to-cyan-500', count: stats?.byType?.image },
              { type: 'audio', icon: Music, label: '오디오', color: 'from-green-500 to-emerald-500', count: stats?.byType?.audio },
              { type: 'document', icon: Play, label: '문서', color: 'from-yellow-500 to-orange-500', count: stats?.byType?.document },
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
                    <p className="text-dark-500 text-sm">{item.count || 0}개의 파일</p>
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
                잊혀진 미디어를 발견하셨나요?
              </h2>
              <p className="text-dark-400 max-w-2xl mx-auto mb-8">
                소중한 미디어를 아카이브에 기여해주세요.
                <br />
                당신의 기여가 디지털 역사를 보존합니다.
              </p>
              <Link to="/upload" className="btn btn-primary px-8 py-3 text-lg">
                <Upload className="w-5 h-5" />
                미디어 업로드하기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
