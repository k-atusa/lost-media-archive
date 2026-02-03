import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      
      {/* Gradient orbs for visual interest */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-60 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      
      <main className="flex-1 pt-16 relative">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
