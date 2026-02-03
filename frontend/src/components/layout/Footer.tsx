import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-dark-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold gradient-text mb-3">Lost Media Archive</h3>
            <p className="text-dark-400 text-sm leading-relaxed max-w-md">
              잊혀진 미디어를 보존하고 발굴하는 분산형 아카이브입니다.
              IPFS를 통해 검열에 강하고 영구적인 미디어 저장소를 제공합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">
              탐색
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/browse?type=video" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  영상
                </a>
              </li>
              <li>
                <a href="/browse?type=image" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  이미지
                </a>
              </li>
              <li>
                <a href="/browse?type=audio" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  오디오
                </a>
              </li>
              <li>
                <a href="/collections" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  컬렉션
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">
              정보
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  소개
                </a>
              </li>
              <li>
                <a href="/upload" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  업로드 가이드
                </a>
              </li>
              <li>
                <a href="https://ipfs.io" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  IPFS란?
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> for preserving digital history
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/k-atusa/lost-media-archive"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-500 hover:text-dark-300 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
