import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Zap,
  Gift,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function Navbar() {
  const { isAuthenticated, user, logout, cart, wishlist } = useStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0d0d1f]/95 backdrop-blur-md border-b border-[#1e1e40]">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#7c3aed] to-[#00f5ff] flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-orbitron font-800 text-sm tracking-widest neon-cyan hidden sm:block">
            NEXUSPLAY
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-5 flex-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/store"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Store
          </NavLink>
          <NavLink
            to="/weekly-free"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="flex items-center gap-1">
              <Gift size={13} className="text-[#00ff88]" />
              Free Games
            </span>
          </NavLink>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 ml-auto">
          <Link
            to="/cart"
            className="relative p-2 rounded hover:bg-[#1e1e40] transition-colors"
          >
            <ShoppingCart size={20} className="text-slate-300" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#7c3aed] text-white text-xs font-orbitron flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/wishlist"
                className="relative p-2 rounded hover:bg-[#1e1e40] transition-colors"
              >
                <Heart
                  size={20}
                  className={
                    wishlist.length ? 'text-[#f0249a]' : 'text-slate-300'
                  }
                />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f0249a] text-white text-xs font-orbitron flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link
                to="/library"
                className="p-2 rounded hover:bg-[#1e1e40] transition-colors"
              >
                <BookOpen size={20} className="text-slate-300" />
              </Link>
            </>
          )}

          {/* User menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded hover:bg-[#1e1e40] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#f0249a] flex items-center justify-center">
                  <span className="text-white font-orbitron text-xs">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#12122a] border border-[#1e1e40] rounded-lg shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#1e1e40]">
                    <p className="font-rajdhani font-600 text-white text-sm">
                      {user?.name}
                    </p>
                    <p className="text-[#4a4a7a] text-xs font-mono-custom">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#1e1e40] transition-colors text-slate-300 text-sm"
                  >
                    <User size={14} /> Profile
                  </Link>
                  <Link
                    to="/library"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#1e1e40] transition-colors text-slate-300 text-sm"
                  >
                    <BookOpen size={14} /> Library
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-[#1e1e40] transition-colors text-[#f87171] text-sm"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-outline text-xs py-1.5 px-3">
                Login
              </Link>
              <Link to="/signup" className="btn-primary text-xs py-1.5 px-3">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded hover:bg-[#1e1e40] transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#1e1e40] bg-[#0d0d1f] px-4 py-3 flex flex-col gap-3">
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            Home
          </NavLink>
          <NavLink
            to="/store"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            Store
          </NavLink>
          <NavLink
            to="/weekly-free"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            Free Games
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/library"
                onClick={() => setMenuOpen(false)}
                className="nav-link"
              >
                Library
              </NavLink>
              <NavLink
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="nav-link"
              >
                Wishlist
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
