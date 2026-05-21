import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, isInCart, isInLibrary, isAuthenticated } = useStore()

  if (!isAuthenticated) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <Heart size={64} className="text-slate-700 mx-auto mb-4" />
      <h2 className="font-orbitron text-2xl text-slate-500 mb-3">LOGIN TO VIEW WISHLIST</h2>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart size={24} className="text-[#f0249a]" />
        <div>
          <h1 className="font-orbitron text-2xl font-700 gradient-text">WISHLIST</h1>
          <p className="text-slate-500 font-rajdhani text-sm">{wishlist.length} games saved</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="text-slate-700 mx-auto mb-4" />
          <h2 className="font-orbitron text-xl text-slate-500 mb-3">WISHLIST IS EMPTY</h2>
          <p className="text-slate-600 font-rajdhani mb-6">Browse the store and heart games you want</p>
          <Link to="/store" className="btn-primary">Browse Store</Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-400 font-rajdhani text-sm">
              Total potential savings: <span className="text-[#00ff88]">
                ${wishlist.reduce((s, g) => s + (g.discount ? g.price * g.discount/100 : 0), 0).toFixed(2)}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlist.map(game => {
              const discount = game.discount || 0
              const finalPrice = discount ? game.price * (1 - discount/100) : game.price
              const inCart = isInCart(game.id)
              const inLib = isInLibrary(game.id)

              return (
                <div key={game.id} className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl overflow-hidden hover:border-[#f0249a33] transition-colors flex">
                  <div className="relative w-36 shrink-0">
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-full h-full object-cover"
                      onError={e => e.target.src = 'https://via.placeholder.com/150/12122a/f0249a?text=Game'}
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 tag tag-pink text-[10px]">-{discount}%</span>
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-1 mb-1">
                        {game.genres?.slice(0,2).map(g => <span key={g.name} className="tag tag-purple text-[10px]">{g.name}</span>)}
                      </div>
                      <Link to={`/game/${game.id}`} className="font-orbitron text-xs text-white hover:neon-pink transition-colors line-clamp-1">
                        {game.name}
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={10} className="rating-star fill-[#f59e0b] text-[#f59e0b]" />
                        <span className="text-slate-500 text-xs">{game.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-orbitron text-sm font-700 neon-pink">${finalPrice.toFixed(2)}</span>
                        {discount > 0 && <span className="price-original font-rajdhani text-xs ml-1">${game.price.toFixed(2)}</span>}
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => toggleWishlist(game)} className="p-1.5 rounded hover:bg-red-900/20 text-slate-500 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                        {inLib ? (
                          <span className="tag tag-green text-[10px]">Owned</span>
                        ) : inCart ? (
                          <Link to="/cart" className="btn-outline text-[10px] py-1 px-2">In Cart</Link>
                        ) : (
                          <button onClick={() => addToCart(game)} className="btn-primary text-[10px] py-1 px-2">
                            <ShoppingCart size={10} className="inline mr-1" />Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add all to cart */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => wishlist.forEach(g => !isInCart(g.id) && !isInLibrary(g.id) && addToCart(g))}
              className="btn-primary text-sm"
            >
              <ShoppingCart size={14} className="inline mr-2" /> Add All to Cart
            </button>
          </div>
        </>
      )}
    </div>
  )
}
