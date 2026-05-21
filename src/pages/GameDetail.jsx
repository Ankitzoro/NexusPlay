import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, CheckCircle, Star, ArrowLeft, Monitor, Calendar, Globe } from 'lucide-react'
import { useGame } from '../hooks/useGames'
import { useStore } from '../context/StoreContext'

export default function GameDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { game, loading } = useGame(id)
  const { addToCart, toggleWishlist, isInCart, isInLibrary, isInWishlist, isWeeklyFree, claimFreeGame, hasClaimed } = useStore()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-[400px] bg-[#1e1e40] rounded-xl" />
          <div className="h-8 bg-[#1e1e40] rounded w-64" />
          <div className="h-4 bg-[#1e1e40] rounded w-full" />
        </div>
      </div>
    )
  }

  if (!game) return (
    <div className="text-center py-20">
      <p className="font-orbitron text-2xl text-slate-600">GAME NOT FOUND</p>
      <button onClick={() => navigate('/store')} className="btn-outline mt-4">Back to Store</button>
    </div>
  )

  const discount = game.discount || 0
  const finalPrice = discount ? game.price * (1 - discount / 100) : game.price
  const inCart = isInCart(game.id)
  const inLib = isInLibrary(game.id)
  const inWishlist = isInWishlist(game.id)
  const weekly = isWeeklyFree(game.id)
  const claimed = hasClaimed(game.id)

  const handleAddToCart = () => {
    if (weekly) {
      claimFreeGame(game)
    } else {
      addToCart(game)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors font-rajdhani">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero */}
      <div className="relative h-[350px] md:h-[450px] rounded-xl overflow-hidden border border-[#1e1e40] mb-8">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060610] via-[#060610]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060610] via-transparent to-transparent" />

        {/* Badges */}
        {weekly && discount === 100 && (
          <div className="absolute top-4 left-4 bg-[#00ff88] text-[#060610] font-orbitron text-xs font-900 px-3 py-1.5 rounded animate-pulse-glow">
            🎁 FREE THIS WEEK
          </div>
        )}
        {discount > 0 && discount < 100 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-[#f0249a] to-[#7c3aed] text-white font-orbitron text-sm font-700 px-3 py-1.5 rounded">
            -{discount}% OFF
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {game.genres?.map(g => <span key={g.name} className="tag tag-purple">{g.name}</span>)}
          </div>

          <h1 className="font-orbitron text-2xl md:text-4xl font-900 text-white mb-4">{game.name}</h1>

          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Star size={16} className="rating-star fill-[#f59e0b] text-[#f59e0b]" />
              <span className="font-orbitron text-sm text-white">{game.rating?.toFixed(1)}</span>
              <span className="text-slate-500 text-sm font-rajdhani">/ 5.0</span>
            </div>
            {game.released && (
              <div className="flex items-center gap-2 text-slate-400 font-rajdhani text-sm">
                <Calendar size={14} />
                <span>{new Date(game.released).toLocaleDateString()}</span>
              </div>
            )}
            {game.website && (
              <a href={game.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#00f5ff] text-sm font-rajdhani hover:underline">
                <Globe size={14} /> Website
              </a>
            )}
          </div>

          <div className="mb-6">
            <h2 className="font-orbitron text-sm text-slate-400 mb-3 tracking-wider">ABOUT THIS GAME</h2>
            <div
              className="text-slate-300 font-rajdhani text-base leading-relaxed prose-invert"
              dangerouslySetInnerHTML={{ __html: game.description || game.description_raw || 'No description available.' }}
            />
          </div>

          {/* Platforms */}
          {game.platforms && (
            <div className="mb-6">
              <h2 className="font-orbitron text-sm text-slate-400 mb-3 tracking-wider">PLATFORMS</h2>
              <div className="flex flex-wrap gap-2">
                {game.platforms.map(({ platform }) => (
                  <div key={platform.id} className="flex items-center gap-1.5 tag tag-cyan">
                    <Monitor size={11} /> {platform.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ESRB / Tags */}
          {game.esrb_rating && (
            <div className="mb-6">
              <h2 className="font-orbitron text-sm text-slate-400 mb-2 tracking-wider">RATING</h2>
              <span className="tag tag-red">{game.esrb_rating.name}</span>
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-6">
            <h3 className="font-orbitron text-sm text-slate-400 mb-4 tracking-wider">GET THIS GAME</h3>

            {/* Price */}
            <div className="mb-6">
              {weekly && discount === 100 ? (
                <div>
                  <p className="price-original font-rajdhani text-base">${game.price?.toFixed(2)}</p>
                  <p className="font-orbitron text-3xl font-900 text-[#00ff88]">FREE</p>
                  <p className="text-[#00ff88] text-xs font-rajdhani mt-1">🎁 Weekly free game!</p>
                </div>
              ) : (
                <div>
                  {discount > 0 && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="price-original font-rajdhani text-base">${game.price?.toFixed(2)}</span>
                      <span className="tag tag-pink font-orbitron">-{discount}%</span>
                    </div>
                  )}
                  <p className="font-orbitron text-3xl font-900 neon-cyan">${finalPrice?.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {inLib ? (
                <div className="flex items-center gap-2 text-[#00ff88] font-orbitron text-sm">
                  <CheckCircle size={18} /> In Your Library
                </div>
              ) : weekly && discount === 100 ? (
                claimed ? (
                  <div className="flex items-center gap-2 text-[#00ff88] font-orbitron text-sm">
                    <CheckCircle size={18} /> Claimed!
                  </div>
                ) : (
                  <button onClick={() => claimFreeGame(game)} className="w-full btn-outline text-sm py-3 border-[#00ff8866] text-[#00ff88] hover:bg-[#00ff8811] hover:border-[#00ff88]">
                    🎁 Claim Free Game
                  </button>
                )
              ) : inCart ? (
                <button onClick={() => navigate('/cart')} className="w-full btn-outline text-sm py-3">
                  View in Cart →
                </button>
              ) : (
                <button onClick={handleAddToCart} className="w-full btn-primary text-sm py-3">
                  <ShoppingCart size={16} className="inline mr-2" /> Add to Cart
                </button>
              )}

              <button
                onClick={() => toggleWishlist(game)}
                className={`w-full btn-outline text-sm py-2.5 flex items-center justify-center gap-2 ${inWishlist ? 'border-[#f0249a66] text-[#f472b6]' : ''}`}
              >
                <Heart size={14} className={inWishlist ? 'fill-[#f0249a]' : ''} />
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Meta */}
            <div className="mt-6 pt-4 border-t border-[#1e1e40] space-y-2">
              {game.metacritic && (
                <div className="flex justify-between text-sm font-rajdhani">
                  <span className="text-slate-500">Metacritic</span>
                  <span className="text-[#00ff88] font-700">{game.metacritic}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-rajdhani">
                <span className="text-slate-500">Released</span>
                <span className="text-white">{game.released || 'TBA'}</span>
              </div>
              {game.developers?.length > 0 && (
                <div className="flex justify-between text-sm font-rajdhani">
                  <span className="text-slate-500">Developer</span>
                  <span className="text-white">{game.developers[0].name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
