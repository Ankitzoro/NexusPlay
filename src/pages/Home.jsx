import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Gift, Zap, TrendingUp, Clock } from 'lucide-react'
import { useGames, useWeeklyFreeGames, useFeaturedGames, MOCK_GAMES } from '../hooks/useGames'
import GameCard from '../components/game/GameCard'
import LoadingGrid from '../components/ui/LoadingGrid'
import { useStore } from '../context/StoreContext'

const POSTERS = [
  {
    id: 1,
    title: 'SUMMER SALE',
    subtitle: 'Up to 75% OFF',
    desc: 'Massive discounts on top AAA titles',
    gradient: 'from-[#7c3aed] via-[#5b21b6] to-[#1e1040]',
    accent: '#00f5ff',
    badge: 'LIMITED TIME',
    games: ['Cyberpunk 2077', 'The Witcher 3', 'Red Dead 2'],
    img: 'https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg',
  },
  {
    id: 2,
    title: 'INDIE SPOTLIGHT',
    subtitle: '50% OFF Indie Bundle',
    desc: 'Handpicked indie gems at half price',
    gradient: 'from-[#0f4c2a] via-[#064e3b] to-[#022c22]',
    accent: '#00ff88',
    badge: 'THIS WEEK',
    games: ['Hollow Knight', 'Hades', 'Stardew Valley'],
    img: 'https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg',
  },
  {
    id: 3,
    title: 'WEEKEND FLASH',
    subtitle: 'Extra 20% with NEXUS20',
    desc: 'Stack your coupon on sale prices',
    gradient: 'from-[#7f1d1d] via-[#9f1239] to-[#500724]',
    accent: '#f0249a',
    badge: '48 HRS ONLY',
    games: ['God of War', 'Elden Ring', 'Sekiro'],
    img: 'https://media.rawg.io/media/games/b29/b294a98dca7e71e48bba5e1cf3f99073.jpg',
  },
]

function HeroBanner() {
  const featured = useFeaturedGames()
  const [idx, setIdx] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % featured.length), 5000)
    return () => clearInterval(t)
  }, [featured.length])

  if (!featured.length) return null
  const game = featured[idx]

  return (
    <div className="relative h-[480px] md:h-[540px] overflow-hidden rounded-xl border border-[#1e1e40]">
      <div className="absolute inset-0">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060610] via-[#060610]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060610] via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-end p-8 md:p-12 max-w-xl">
        <div className="flex gap-2 mb-3">
          {game.genres?.slice(0,2).map(g => <span key={g.name} className="tag tag-cyan">{g.name}</span>)}
          <span className="tag tag-purple">FEATURED</span>
        </div>

        <h1 className="font-orbitron text-3xl md:text-5xl font-900 text-white mb-3 leading-tight">{game.name}</h1>
        <p className="text-slate-400 font-rajdhani text-base mb-6 line-clamp-2">{game.description}</p>

        <div className="flex items-center gap-4">
          {game.discount > 0 ? (
            <div>
              <p className="price-original font-rajdhani">${game.price}</p>
              <p className="font-orbitron text-2xl font-700 neon-cyan">${(game.price * (1 - game.discount/100)).toFixed(2)}</p>
            </div>
          ) : (
            <p className="font-orbitron text-2xl font-700 neon-cyan">${game.price}</p>
          )}
          <button onClick={() => navigate(`/game/${game.id}`)} className="btn-primary">
            View Game <ChevronRight size={14} className="inline" />
          </button>
          <button onClick={() => navigate('/store')} className="btn-outline">Browse All</button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 right-8 flex gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-[#00f5ff] w-6' : 'bg-[#1e1e40]'}`}
          />
        ))}
      </div>
    </div>
  )
}

function DiscountPosters() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={18} className="neon-pink" />
        <h2 className="font-orbitron text-lg text-white tracking-wider">HOT DEALS</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#f0249a33] to-transparent" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {POSTERS.map(poster => (
          <Link to="/store" key={poster.id}>
            <div className={`poster-card h-48 bg-gradient-to-br ${poster.gradient} relative`}>
              <img
                src={poster.img}
                alt={poster.title}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
              />
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div>
                  <span
                    className="tag text-xs font-mono-custom font-700 mb-2 inline-block"
                    style={{ background: poster.accent + '22', color: poster.accent, border: `1px solid ${poster.accent}44` }}
                  >
                    {poster.badge}
                  </span>
                  <h3 className="font-orbitron text-xl font-900 text-white mt-1">{poster.title}</h3>
                  <p style={{ color: poster.accent }} className="font-orbitron text-sm font-700 mt-0.5">{poster.subtitle}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-rajdhani mb-2">{poster.desc}</p>
                  <div className="flex gap-1 flex-wrap">
                    {poster.games.map(g => (
                      <span key={g} className="text-xs text-slate-500 font-mono-custom bg-black/30 px-1.5 py-0.5 rounded">{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function WeeklyFreeSection() {
  const freeGames = useWeeklyFreeGames()
  const { claimFreeGame, hasClaimed, isInLibrary } = useStore()
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, mins: 22 })

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins } = prev
        mins--
        if (mins < 0) { mins = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        if (days < 0) return { days: 6, hours: 23, mins: 59 }
        return { days, hours, mins }
      })
    }, 60000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Gift size={18} className="text-[#00ff88]" />
        <h2 className="font-orbitron text-lg text-white tracking-wider">FREE THIS WEEK</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#00ff8833] to-transparent" />
        <div className="flex items-center gap-2 bg-[#0d1f0d] border border-[#00ff8833] rounded px-3 py-1">
          <Clock size={12} className="text-[#00ff88]" />
          <span className="font-mono-custom text-xs text-[#00ff88]">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m left
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {freeGames.map(game => {
          const claimed = hasClaimed(game.id) || isInLibrary(game.id)
          return (
            <div key={game.id} className="weekly-free-card">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f0d] via-transparent to-transparent" />
                <span className="free-badge animate-pulse-glow">100% FREE</span>
              </div>
              <div className="p-4">
                <div className="flex gap-1 mb-2">
                  {game.genres?.slice(0,2).map(g => <span key={g.name} className="tag tag-green">{g.name}</span>)}
                </div>
                <h3 className="font-orbitron text-sm font-700 text-white mb-1">{game.name}</h3>
                <p className="text-slate-500 text-xs font-rajdhani mb-3 line-clamp-2">{game.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="price-original font-rajdhani text-sm">${game.price}</span>
                    <span className="font-orbitron text-sm font-700 text-[#00ff88] ml-2">FREE</span>
                  </div>
                  {claimed ? (
                    <span className="tag tag-green flex items-center gap-1">✓ Claimed</span>
                  ) : (
                    <button
                      onClick={() => claimFreeGame(game)}
                      className="btn-outline text-xs py-1 px-3 border-[#00ff8855] text-[#00ff88] hover:bg-[#00ff8811] hover:border-[#00ff88]"
                    >
                      Claim Free
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-4">
        <Link to="/weekly-free" className="btn-outline text-xs">
          View Weekly Free Games <ChevronRight size={12} className="inline" />
        </Link>
      </div>
    </section>
  )
}

function CouponBanner() {
  return (
    <div className="mb-12 p-5 rounded-xl border border-[#7c3aed33] bg-gradient-to-r from-[#12122a] via-[#1a0a3a] to-[#12122a] flex flex-col sm:flex-row items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#7c3aed22] flex items-center justify-center">
          <Zap size={20} className="text-[#7c3aed]" />
        </div>
        <div>
          <h3 className="font-orbitron text-sm text-white">SAVE MORE WITH COUPON CODES</h3>
          <p className="text-slate-500 text-xs font-rajdhani">Apply at checkout for extra discounts</p>
        </div>
      </div>
      <div className="flex gap-3 flex-wrap justify-center sm:ml-auto">
        {[['NEXUS20', '20% OFF'], ['GAMER50', '50% OFF'], ['NEWUSER', '15% OFF']].map(([code, label]) => (
          <div key={code} className="flex items-center gap-2 bg-[#060610] border border-[#7c3aed44] rounded px-3 py-1.5">
            <span className="font-mono-custom text-[#00f5ff] text-xs font-700">{code}</span>
            <span className="text-[#7c3aed] text-xs font-rajdhani font-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const { games, loading } = useGames({ pageSize: 8, excludeWeeklyFree: true })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-12">
        <HeroBanner />
      </div>

      {/* Coupons */}
      <CouponBanner />

      {/* Posters */}
      <DiscountPosters />

      {/* Weekly Free */}
      <WeeklyFreeSection />

      {/* Featured Games */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={18} className="neon-purple" />
          <h2 className="font-orbitron text-lg text-white tracking-wider">TRENDING NOW</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#7c3aed33] to-transparent" />
          <Link to="/store" className="text-xs text-[#7c3aed] font-orbitron hover:text-[#a78bfa] transition-colors">
            View All <ChevronRight size={12} className="inline" />
          </Link>
        </div>

        {loading ? (
          <LoadingGrid count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.slice(0, 8).map(game => <GameCard key={game.id} game={game} />)}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <div className="relative rounded-xl overflow-hidden border border-[#7c3aed33] p-10 text-center bg-grid">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed11] to-[#f0249a11]" />
        <div className="relative">
          <h2 className="font-orbitron text-2xl md:text-4xl font-900 gradient-text mb-3">YOUR NEXT ADVENTURE AWAITS</h2>
          <p className="text-slate-400 font-rajdhani text-lg mb-6">Join millions of gamers on NexusPlay</p>
          <Link to="/store" className="btn-primary text-sm px-8 py-3">Browse All Games</Link>
        </div>
      </div>
    </div>
  )
}
