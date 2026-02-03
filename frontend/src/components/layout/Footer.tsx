import { Github, Heart } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-dark-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold gradient-text mb-3">Lost Media Archive</h3>
            <p className="text-dark-400 text-sm leading-relaxed max-w-md">
              {t('footer.description').split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx === 0 && <br />}
                </span>
              ))}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">
              {t('footer.explore')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/browse?type=video" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  {t('footer.video')}
                </a>
              </li>
              <li>
                <a href="/browse?type=image" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  {t('footer.image')}
                </a>
              </li>
              <li>
                <a href="/browse?type=audio" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  {t('footer.audio')}
                </a>
              </li>
              <li>
                <a href="/collections" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  {t('footer.collections')}
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">
              {t('footer.info')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  {t('footer.about')}
                </a>
              </li>
              <li>
                <a href="/upload" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  {t('footer.uploadGuide')}
                </a>
              </li>
              <li>
                <a href="https://ipfs.io" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  {t('footer.whatIsIpfs')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm flex items-center gap-1">
            {t('footer.madeWith')} <Heart className="w-4 h-4 text-red-500" />
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
