import { Link } from 'react-router-dom';
import { Zap, Twitter, Github, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-dark-surface border-dark-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-[#7c3aed] to-[#00f5ff] flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-orbitron font-800 text-sm tracking-widest neon-cyan">
                NEXUSPLAY
              </span>
            </div>
            <p className="text-slate-500 text-sm font-rajdhani leading-relaxed">
              The next-gen gaming marketplace. Discover, play, and collect the
              best games across all platforms.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="p-2 rounded bg-[#12122a] hover:bg-[#1e1e40] transition-colors text-slate-400 hover:text-white"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="p-2 rounded bg-[#12122a] hover:bg-[#1e1e40] transition-colors text-slate-400 hover:text-white"
              >
                <Github size={16} />
              </a>
              <a
                href="#"
                className="p-2 rounded bg-[#12122a] hover:bg-[#1e1e40] transition-colors text-slate-400 hover:text-white"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-orbitron text-xs text-white mb-4 tracking-widest">
              STORE
            </h4>
            <ul className="space-y-2">
              {[
                'Home',
                'Browse Store',
                'Free Games',
                'New Releases',
                'Top Rated',
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-slate-500 hover:text-slate-200 text-sm font-rajdhani transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron text-xs text-white mb-4 tracking-widest">
              ACCOUNT
            </h4>
            <ul className="space-y-2">
              {['Login', 'Sign Up', 'Library', 'Wishlist', 'Profile'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-slate-500 hover:text-slate-200 text-sm font-rajdhani transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron text-xs text-white mb-4 tracking-widest">
              SUPPORT
            </h4>
            <ul className="space-y-2">
              {[
                'Help Center',
                'Contact Us',
                'Refund Policy',
                'Privacy Policy',
                'Terms of Service',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-slate-200 text-sm font-rajdhani transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded bg-[#12122a] border border-[#1e1e40]">
              <p className="text-[#00ff88] text-xs font-mono-custom mb-1">
                ACTIVE COUPON CODES:
              </p>
              <p className="text-slate-400 text-xs font-mono-custom">
                NEXUS20 · GAMER50 · NEWUSER
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1e1e40] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs font-mono-custom">
            © 2025 NexusPlay. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs font-mono-custom">
            Game data powered by <span className="text-[#7c3aed]">RAWG.io</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
