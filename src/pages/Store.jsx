import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useGames } from '../hooks/useGames'
import GameCard from '../components/game/GameCard'
import LoadingGrid from '../components/ui/LoadingGrid'

const GENRES = ['Action', 'RPG', 'Adventure', 'Shooter', 'Strategy', 'Simulation', 'Sports', 'Indie', 'Horror', 'Puzzle']
const SORT_OPTIONS = [
  { value: '-rating', label: 'Top Rated' },
  { value: '-released', label: 'Newest' },
  { value: '-added', label: 'Most Popular' },
  { value: 'name', label: 'A-Z' },
]

export default function Store() {
  const [search, setSearch] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sort, setSort] = useState('-rating')
  const [priceRange, setPriceRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const { games, loading } = useGames({
    search: activeSearch,
    genres: selectedGenre,
    ordering: sort,
    pageSize: 20,
  })

  const filtered = games.filter(game => {
    if (priceRange === 'free') return game.discount === 100
    if (priceRange === 'under15') return (game.price * (1 - (game.discount||0)/100)) < 15
    if (priceRange === 'under30') return (game.price * (1 - (game.discount||0)/100)) < 30
    if (priceRange === 'sale') return game.discount > 0
    return true
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setActiveSearch(search)
  }

  const clearFilters = () => {
    setSearch('')
    setActiveSearch('')
    setSelectedGenre('')
    setSort('-rating')
    setPriceRange('all')
  }

  const hasFilters = activeSearch || selectedGenre || sort !== '-rating' || priceRange !== 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-orbitron text-2xl font-700 gradient-text mb-1">GAME STORE</h1>
        <p className="text-slate-500 font-rajdhani">{filtered.length} games available</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search games..."
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary px-6">Search</button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="btn-outline px-4 flex items-center gap-2"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="btn-outline px-3 border-red-800 text-red-400 hover:bg-red-900/20">
            <X size={14} />
          </button>
        )}
      </form>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 p-5 bg-[#0d0d1f] border border-[#1e1e40] rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sort */}
            <div>
              <label className="block font-orbitron text-xs text-slate-400 mb-2 tracking-wider">SORT BY</label>
              <div className="flex flex-col gap-1.5">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`text-left px-3 py-1.5 rounded text-sm font-rajdhani transition-colors ${sort === opt.value ? 'bg-[#7c3aed22] text-[#a78bfa] border border-[#7c3aed44]' : 'text-slate-400 hover:text-white hover:bg-[#1e1e40]'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block font-orbitron text-xs text-slate-400 mb-2 tracking-wider">GENRE</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGenre('')}
                  className={`tag cursor-pointer ${!selectedGenre ? 'tag-cyan' : 'tag-purple'}`}
                >All</button>
                {GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g === selectedGenre ? '' : g)}
                    className={`tag cursor-pointer ${selectedGenre === g ? 'tag-cyan' : 'tag-purple'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block font-orbitron text-xs text-slate-400 mb-2 tracking-wider">PRICE</label>
              <div className="flex flex-col gap-1.5">
                {[
                  ['all', 'All Prices'],
                  ['free', 'Free Only'],
                  ['sale', 'On Sale'],
                  ['under15', 'Under $15'],
                  ['under30', 'Under $30'],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setPriceRange(val)}
                    className={`text-left px-3 py-1.5 rounded text-sm font-rajdhani transition-colors ${priceRange === val ? 'bg-[#00ff8811] text-[#00ff88] border border-[#00ff8833]' : 'text-slate-400 hover:text-white hover:bg-[#1e1e40]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active filters chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeSearch && <span className="tag tag-cyan">Search: {activeSearch}</span>}
          {selectedGenre && <span className="tag tag-purple">Genre: {selectedGenre}</span>}
          {priceRange !== 'all' && <span className="tag tag-green">Price: {priceRange}</span>}
        </div>
      )}

      {/* Games grid */}
      {loading ? (
        <LoadingGrid count={12} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-orbitron text-2xl text-slate-600 mb-3">NO GAMES FOUND</p>
          <p className="text-slate-500 font-rajdhani mb-6">Try adjusting your filters</p>
          <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      )}
    </div>
  )
}
