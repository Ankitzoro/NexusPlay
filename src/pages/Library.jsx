import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Play, Search, Calendar, Gift, ShoppingBag } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Library() {
  const { library, isAuthenticated } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  if (!isAuthenticated) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <BookOpen size={64} className="text-slate-700 mx-auto mb-4" />
      <h2 className="font-orbitron text-2xl text-slate-500 mb-3">LOGIN TO VIEW LIBRARY</h2>
      <p className="text-slate-600 font-rajdhani mb-6">Sign in to access your game collection</p>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  )

  const filtered = library.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'free' && g.free) || (filter === 'purchased' && !g.free)
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={24} className="neon-purple" />
        <div>
          <h1 className="font-orbitron text-2xl font-700 gradient-text">MY LIBRARY</h1>
          <p className="text-slate-500 font-rajdhani text-sm">{library.length} games in collection</p>
        </div>
      </div>

      {library.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={64} className="text-slate-700 mx-auto mb-4" />
          <h2 className="font-orbitron text-xl text-slate-500 mb-3">EMPTY LIBRARY</h2>
          <p className="text-slate-600 font-rajdhani mb-6">Start building your collection!</p>
          <div className="flex gap-3 justify-center">
            <Link to="/store" className="btn-primary">Browse Store</Link>
            <Link to="/weekly-free" className="btn-outline">Claim Free Games</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search library..."
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'purchased', 'free'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`tag cursor-pointer capitalize ${filter === f ? 'tag-cyan' : 'tag-purple'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-lg p-3 text-center">
              <p className="font-orbitron text-xl font-700 neon-purple">{library.length}</p>
              <p className="text-slate-500 text-xs font-rajdhani">Total Games</p>
            </div>
            <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-lg p-3 text-center">
              <p className="font-orbitron text-xl font-700 text-[#00ff88]">{library.filter(g => g.free).length}</p>
              <p className="text-slate-500 text-xs font-rajdhani">Free Games</p>
            </div>
            <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-lg p-3 text-center">
              <p className="font-orbitron text-xl font-700 neon-cyan">{library.filter(g => !g.free).length}</p>
              <p className="text-slate-500 text-xs font-rajdhani">Purchased</p>
            </div>
          </div>

          {/* Games list */}
          <div className="space-y-3">
            {filtered.map(game => (
              <div key={game.id} className="library-card p-4">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-28 h-18 rounded object-cover shrink-0 hidden sm:block"
                  style={{ width: '7rem', height: '4.5rem' }}
                  onError={e => e.target.style.display = 'none'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-1">
                    {game.genres?.slice(0,2).map(g => <span key={g.name} className="tag tag-purple text-[10px]">{g.name}</span>)}
                    {game.free && <span className="tag tag-green text-[10px]"><Gift size={8} className="inline" /> Free</span>}
                  </div>
                  <Link to={`/game/${game.id}`} className="font-orbitron text-sm text-white hover:neon-cyan transition-colors">
                    {game.name}
                  </Link>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-slate-500 text-xs font-rajdhani flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(game.purchasedAt).toLocaleDateString()}
                    </span>
                    {!game.free && (
                      <span className="text-slate-500 text-xs font-rajdhani flex items-center gap-1">
                        <ShoppingBag size={10} /> Purchased
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0 justify-center">
                  <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                    <Play size={11} /> Play
                  </button>
                  <Link to={`/game/${game.id}`} className="btn-outline text-xs py-1 px-3 text-center">
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-600 font-rajdhani">No games match your search</div>
          )}
        </>
      )}
    </div>
  )
}
