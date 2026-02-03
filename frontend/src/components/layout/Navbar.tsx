import { Link } from 'react-router-dom';
import { Film, Search, Upload, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold gradient-text">Lost Media</span>
              <span className="text-lg font-light text-dark-300 ml-1">Archive</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse" className="btn btn-ghost">
              탐색
            </Link>
            <Link to="/collections" className="btn btn-ghost">
              컬렉션
            </Link>
            <Link to="/about" className="btn btn-ghost">
              소개
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/search" className="btn btn-ghost p-2">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/upload" className="btn btn-primary">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">업로드</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-ghost p-2 md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-dark-700/50"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/browse"
                className="block btn btn-ghost w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                탐색
              </Link>
              <Link
                to="/collections"
                className="block btn btn-ghost w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                컬렉션
              </Link>
              <Link
                to="/about"
                className="block btn btn-ghost w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                소개
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
