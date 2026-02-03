import { motion } from 'framer-motion';
import { Shield, Globe, Zap, Database, Lock, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
          {t('about.title')}
        </h1>
        <p className="text-xl text-dark-300 leading-relaxed max-w-2xl mx-auto">
          {t('about.subtitle').split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              {idx === 0 && <br />}
            </span>
          ))}
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-dark-100 mb-4">{t('about.missionTitle')}</h2>
        <p className="text-dark-300 leading-relaxed">
          {t('about.missionBody').split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              {line === '' ? <><br /><br /></> : <br />}
            </span>
          ))}
        </p>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-dark-100 mb-6">{t('about.howTitle')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Database,
              title: t('about.howItems.ipfs.title'),
              description: t('about.howItems.ipfs.desc'),
            },
            {
              icon: Lock,
              title: t('about.howItems.cid.title'),
              description: t('about.howItems.cid.desc'),
            },
            {
              icon: Zap,
              title: t('about.howItems.stream.title'),
              description: t('about.howItems.stream.desc'),
            },
            {
              icon: Globe,
              title: t('about.howItems.distributed.title'),
              description: t('about.howItems.distributed.desc'),
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">{item.title}</h3>
              <p className="text-dark-400 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-dark-100 mb-6">{t('about.featuresTitle')}</h2>
        <div className="space-y-4">
          {[
            {
              icon: Shield,
              title: t('about.features.censorship.title'),
              description: t('about.features.censorship.desc'),
            },
            {
              icon: Globe,
              title: t('about.features.permanent.title'),
              description: t('about.features.permanent.desc'),
            },
            {
              icon: Users,
              title: t('about.features.open.title'),
              description: t('about.features.open.desc'),
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-100 mb-1">{item.title}</h3>
                <p className="text-dark-400 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Technical Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-dark-100 mb-6">{t('about.stackTitle')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">{t('about.stackFrontend')}</h3>
            <ul className="space-y-2 text-dark-400">
              <li>• React + TypeScript</li>
              <li>• Vite</li>
              <li>• TailwindCSS</li>
              <li>• Framer Motion</li>
              <li>• TanStack Query</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">{t('about.stackBackend')}</h3>
            <ul className="space-y-2 text-dark-400">
              <li>• Node.js + TypeScript</li>
              <li>• Express</li>
              <li>• SQLite (better-sqlite3)</li>
              <li>• IPFS (go-ipfs daemon)</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Disclaimer */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-8 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-yellow-500/20"
      >
        <h2 className="text-2xl font-bold text-dark-100 mb-4">{t('about.disclaimerTitle')}</h2>
        <ul className="space-y-2 text-dark-400 text-sm">
          {t('about.disclaimer').split('||').map((item, idx) => (
            <li key={idx}>• {item}</li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}
