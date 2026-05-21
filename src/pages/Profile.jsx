import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, BookOpen, Heart, ShoppingBag, Settings, LogOut, Edit2, Save, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Profile() {
  const { user, isAuthenticated, logout, library, wishlist, cart, showToast } = useStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')

  if (!isAuthenticated) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <User size={64} className="text-slate-700 mx-auto mb-4" />
      <h2 className="font-orbitron text-2xl text-slate-500 mb-3">NOT LOGGED IN</h2>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  )

  const handleSave = () => {
    showToast('Profile updated!')
    setEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const stats = [
    { label: 'Games Owned', value: library.length, icon: BookOpen, color: 'neon-purple' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, color: 'text-[#f0249a]' },
    { label: 'Cart Items', value: cart.length, icon: ShoppingBag, color: 'neon-cyan' },
    { label: 'Free Claimed', value: library.filter(g => g.free).length, icon: Settings, color: 'text-[#00ff88]' },
  ]

  const totalSpent = library
    .filter(g => !g.free)
    .reduce((s, g) => s + (g.discount ? g.price * (1 - g.discount/100) : g.price || 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-orbitron text-2xl font-700 gradient-text mb-8">MY PROFILE</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="md:col-span-1">
          <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-6 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#f0249a] flex items-center justify-center mx-auto">
                <span className="font-orbitron text-3xl font-900 text-white">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#00ff88] border-2 border-[#0d0d1f]" />
            </div>

            {editing ? (
              <div className="mb-3">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field text-center text-sm py-1.5"
                />
                <div className="flex gap-2 mt-2 justify-center">
                  <button onClick={handleSave} className="btn-primary text-xs py-1 px-3">
                    <Save size={11} className="inline mr-1" />Save
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-outline text-xs py-1 px-3">
                    <X size={11} className="inline mr-1" />Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="font-orbitron text-base text-white">{user?.name}</h2>
                  <button onClick={() => setEditing(true)} className="text-slate-500 hover:text-white transition-colors">
                    <Edit2 size={13} />
                  </button>
                </div>
              </div>
            )}

            <p className="text-slate-500 font-mono-custom text-xs mb-1">{user?.email}</p>
            <span className="tag tag-purple text-[10px]">NEXUS MEMBER</span>

            {/* Member since */}
            <div className="mt-4 pt-4 border-t border-[#1e1e40]">
              <p className="text-slate-600 text-xs font-mono-custom">Member since</p>
              <p className="text-slate-400 text-xs font-rajdhani">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>

            <button onClick={handleLogout} className="w-full btn-danger mt-4 text-xs py-2.5 flex items-center justify-center gap-2">
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats + Recent */}
        <div className="md:col-span-2 space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#12122a] flex items-center justify-center">
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <p className="font-orbitron text-xl font-700 text-white">{value}</p>
                  <p className="text-slate-500 text-xs font-rajdhani">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total spent */}
          <div className="bg-gradient-to-r from-[#7c3aed11] to-[#00f5ff11] border border-[#7c3aed33] rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-orbitron text-xs text-slate-400 mb-1 tracking-wider">TOTAL SPENT</p>
              <p className="font-orbitron text-2xl font-900 neon-cyan">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-sm font-rajdhani">Across {library.filter(g => !g.free).length} purchases</p>
              <p className="text-[#00ff88] text-xs font-rajdhani">{library.filter(g => g.free).length} games claimed free</p>
            </div>
          </div>

          {/* Recent library */}
          <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron text-xs text-slate-400 tracking-wider">RECENT GAMES</h3>
              <Link to="/library" className="text-xs text-[#7c3aed] font-orbitron hover:text-[#a78bfa]">
                View All <span className="neon-cyan">→</span>
              </Link>
            </div>

            {library.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-slate-600 font-rajdhani text-sm mb-3">No games yet</p>
                <Link to="/store" className="btn-primary text-xs">Browse Store</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {library.slice(-5).reverse().map(game => (
                  <div key={game.id} className="flex items-center gap-3 p-2 rounded hover:bg-[#12122a] transition-colors">
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-12 h-8 rounded object-cover"
                      onError={e => e.target.style.display = 'none'}
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/game/${game.id}`} className="font-orbitron text-xs text-white hover:neon-cyan transition-colors line-clamp-1">
                        {game.name}
                      </Link>
                      <p className="text-slate-600 text-[10px] font-mono-custom">
                        {new Date(game.purchasedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {game.free && <span className="tag tag-green text-[10px]">Free</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/library" className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4 flex items-center gap-3 hover:border-[#7c3aed44] transition-colors">
              <BookOpen size={18} className="neon-purple" />
              <div>
                <p className="font-orbitron text-xs text-white">Library</p>
                <p className="text-slate-500 text-xs font-rajdhani">All your games</p>
              </div>
            </Link>
            <Link to="/wishlist" className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4 flex items-center gap-3 hover:border-[#f0249a44] transition-colors">
              <Heart size={18} className="text-[#f0249a]" />
              <div>
                <p className="font-orbitron text-xs text-white">Wishlist</p>
                <p className="text-slate-500 text-xs font-rajdhani">Saved games</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
