import { motion } from 'framer-motion';
import { Shield, Globe, Zap, Database, Lock, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
          Lost Media Archive
        </h1>
        <p className="text-xl text-dark-300 leading-relaxed max-w-2xl mx-auto">
          잊혀진 미디어를 영원히 보존하는
          <br />
          분산형 아카이브 프로젝트입니다.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-dark-100 mb-4">📌 미션</h2>
        <p className="text-dark-300 leading-relaxed">
          디지털 시대에 수많은 미디어가 생성되고 사라집니다. 
          TV 광고, 방송 프로그램, 뮤직비디오, 온라인 콘텐츠 등 
          한때 존재했지만 더 이상 접근할 수 없는 "로스트 미디어"는 
          문화적, 역사적 가치를 지닙니다.
          <br /><br />
          Lost Media Archive는 이러한 미디어를 분산 저장 기술을 활용하여 
          영구적으로 보존하고, 누구나 접근할 수 있도록 공개하는 것을 목표로 합니다.
        </p>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-dark-100 mb-6">🔧 작동 방식</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Database,
              title: 'IPFS 저장',
              description: '모든 미디어는 InterPlanetary File System(IPFS)에 저장됩니다. 콘텐츠 기반 주소 지정을 통해 데이터 무결성이 보장됩니다.',
            },
            {
              icon: Lock,
              title: 'CID 보호',
              description: 'IPFS 콘텐츠 식별자(CID)는 외부에 노출되지 않습니다. 내부 ID 매핑을 통해 프라이버시를 보호합니다.',
            },
            {
              icon: Zap,
              title: '직접 스트리밍',
              description: '업로드 시 파일이 서버에 저장되지 않고 직접 IPFS로 스트리밍됩니다. 서버는 파이프 역할만 수행합니다.',
            },
            {
              icon: Globe,
              title: '분산 네트워크',
              description: 'IPFS 네트워크의 여러 노드에 복제되어 단일 장애점 없이 안정적으로 서비스됩니다.',
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
        <h2 className="text-2xl font-bold text-dark-100 mb-6">✨ 특징</h2>
        <div className="space-y-4">
          {[
            {
              icon: Shield,
              title: '검열 저항',
              description: '중앙 서버가 없어 특정 주체에 의한 임의 삭제가 불가능합니다.',
            },
            {
              icon: Globe,
              title: '영구 보존',
              description: '한번 업로드된 콘텐츠는 네트워크가 존재하는 한 영구적으로 보존됩니다.',
            },
            {
              icon: Users,
              title: '오픈 아카이브',
              description: '누구나 미디어를 기여하고 열람할 수 있는 개방형 아카이브입니다.',
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
        <h2 className="text-2xl font-bold text-dark-100 mb-6">🛠️ 기술 스택</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">Frontend</h3>
            <ul className="space-y-2 text-dark-400">
              <li>• React + TypeScript</li>
              <li>• Vite</li>
              <li>• TailwindCSS</li>
              <li>• Framer Motion</li>
              <li>• TanStack Query</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">Backend</h3>
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
        <h2 className="text-2xl font-bold text-dark-100 mb-4">⚠️ 주의사항</h2>
        <ul className="space-y-2 text-dark-400 text-sm">
          <li>• 저작권을 침해하는 콘텐츠의 업로드는 금지됩니다.</li>
          <li>• 본 아카이브는 문화적, 역사적 보존을 목적으로 합니다.</li>
          <li>• 업로드된 콘텐츠에 대한 책임은 업로더에게 있습니다.</li>
          <li>• 문제가 있는 콘텐츠 발견 시 신고해 주세요.</li>
        </ul>
      </motion.section>
    </div>
  );
}
