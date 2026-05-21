import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function GameCard({ game }) {
  const {
    addToCart,
    toggleWishlist,
    isInCart,
    isInLibrary,
    isInWishlist,
    isWeeklyFree,
  } = useStore();

  const price = game.price || 0;
  const discount = game.discount || 0;
  const finalPrice = discount ? price * (1 - discount / 100) : price;
  const inCart = isInCart(game.id);
  const inLib = isInLibrary(game.id);
  const inWishlist = isInWishlist(game.id);
  const weekly = isWeeklyFree(game.id);

  const genres = game.genres?.slice(0, 2).map((g) => g.name) || [];
  const platforms =
    game.platforms?.slice(0, 3).map((p) => p.platform.name) || [];

  return (
    <div className="game-card group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-dark-border">
        <img
          src={
            game.background_image ||
            'https://via.placeholder.com/400x200/12122a/7c3aed?text=Game'
          }
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/400x200/12122a/7c3aed?text=Game';
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-dark-card via-transparent to-transparent opacity-80" />

        {/* Badge */}
        {weekly && discount === 100 ? (
          <span className="free-badge">FREE THIS WEEK</span>
        ) : discount > 0 ? (
          <span className="discount-badge">-{discount}%</span>
        ) : null}

        {/* Wishlist btn */}
        <button
          onClick={() => toggleWishlist(game)}
          className="absolute top-2 left-2 p-1.5 rounded bg-dark-base/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <Heart
            size={14}
            className={
              inWishlist ? 'fill-neon-pink' : 'text-white'
            }
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Genres */}
        <div className="flex gap-1 mb-2 flex-wrap">
          {genres.map((g) => (
            <span key={g} className="tag tag-purple">
              {g}
            </span>
          ))}
        </div>

        <Link to={`/game/${game.id}`}>
          <h3 className="font-orbitron text-xs font-600 text-white mb-1 line-clamp-1 hover:neon-cyan transition-colors">
            {game.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star
            size={11}
            className="rating-star fill-[#f59e0b] text-[#f59e0b]"
          />
          <span className="text-slate-400 text-xs font-mono-custom">
            {game.rating?.toFixed(1) || '—'}
          </span>
          {platforms.length > 0 && (
            <span className="text-slate-600 text-xs ml-auto font-rajdhani">
              {platforms.join(' · ')}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            {discount === 100 || weekly ? (
              <span className="font-orbitron text-xs font-700 text-neon-green">
                FREE
              </span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="font-orbitron text-sm font-700 text-white">
                  ${finalPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className="price-original font-rajdhani text-xs">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          {inLib ? (
            <span className="flex items-center gap-1 text-neon-green text-xs font-orbitron">
              <CheckCircle size={12} /> Owned
            </span>
          ) : inCart ? (
            <Link to="/cart" className="btn-outline text-xs py-1 px-2">
              In Cart
            </Link>
          ) : (
            <button
              onClick={() => addToCart(game)}
              className="btn-primary text-xs py-1 px-2"
            >
              <ShoppingCart size={11} className="inline mr-1" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
