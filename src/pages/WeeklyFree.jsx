import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Gift, Clock, CheckCircle, ChevronRight, Star, Zap } from 'lucide-react'
import { useWeeklyFreeGames, MOCK_GAMES } from '../hooks/useGames'
import { useStore } from '../context/StoreContext'

function Countdown() {
  const [time, setTime] = useState({ days: 3, hours: 14, mins: 22, secs: 45 })

  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { days, hours, mins, secs } = prev
        secs--
        if (secs < 0) { secs = 59; mins-- }
        if (mins < 0) { mins = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        if (days < 0) return { days: 6, hours: 23, mins: 59, secs: 59 }
        return { days, hours, mins, secs }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const pad = n => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-3">
      {[['days', time.days], ['hrs', time.hours], ['min', time.mins], ['sec', time.secs]].map(([label, val]) => (
        <div key={label} className="text-center">
          <div className="w-14 h-14 bg-[#0d0d1f] border border-[#00ff8844] rounded-lg flex items-center justify-center">
            <span className="font-orbitron text-xl font-700 text-[#00ff88]">{pad(val)}</span>
          </div>
          <p className="text-[#00ff88] text-[10px] font-orbitron mt-1 tracking-wider">{label.toUpperCase()}</p>
        </div>
      ))}
    </div>
  )
}

const UPCOMING = MOCK_GAMES.filter(g => [6, 8, 10].includes(g.id))
const PAST_FREE = MOCK_GAMES.filter(g => [9, 12, 7].includes(g.id))

export default function WeeklyFree() {
  const freeGames = useWeeklyFreeGames()
  const { claimFreeGame, hasClaimed, isInLibrary, isAuthenticated } = useStore()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#00ff8833] mb-12 p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a0d] via-[#0d1f0d] to-[#060610]" />
        <div className="absolute inset-0 bg-scan opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff88] opacity-3 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Gift size={20} className="text-[#00ff88] animate-pulse-glow" />
            <span className="tag tag-green font-orbitron tracking-wider">FREE THIS WEEK</span>
          </div>
          <h1 className="font-orbitron text-3xl md:text-5xl font-900 text-white mb-3">
            WEEKLY FREE<br /><span style={{ color: '#00ff88' }}>GAMES</span>
          </h1>
          <p className="text-slate-400 font-rajdhani text-lg mb-8 max-w-lg">
            Claim up to 3 games for free every week. No strings attached — they're yours to keep forever.
          </p>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-[#00ff88]" />
              <p className="font-orbitron text-xs text-slate-400 tracking-wider">OFFER ENDS IN</p>
            </div>
            <Countdown />
          </div>

          {!isAuthenticated && (
            <div className="inline-flex items-center gap-3 bg-[#00ff8811] border border-[#00ff8833] rounded-lg px-4 py-3">
              <Zap size={16} className="text-[#00ff88]" />
              <span className="text-[#00ff88] font-rajdhani text-sm">
                <Link to="/login" className="underline font-700">Sign in</Link> to claim your free games!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Current free games */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-orbitron text-lg text-white">THIS WEEK'S FREE GAMES</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#00ff8833] to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freeGames.map((game, i) => {
            const claimed = hasClaimed(game.id) || isInLibrary(game.id)
            return (
              <div key={game.id} className="weekly-free-card overflow-hidden">
                <div className="relative h-52">
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    onError={e => e.target.src = 'https://via.placeholder.com/400x208/0d1f0d/00ff88?text=Free+Game'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f0d] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-[#00ff88] text-[#060610] font-orbitron text-xs font-900 px-2 py-1 rounded animate-pulse-glow">
                    FREE #{i + 1}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                    <span className="price-original text-slate-300 font-rajdhani text-xs">${game.price}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    {game.genres?.slice(0,2).map(g => <span key={g.name} className="tag tag-green">{g.name}</span>)}
                  </div>
                  <Link to={`/game/${game.id}`} className="font-orbitron text-base font-700 text-white hover:text-[#00ff88] transition-colors">
                    {game.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <Star size={12} className="rating-star fill-[#f59e0b] text-[#f59e0b]" />
                    <span className="text-slate-400 text-xs font-mono-custom">{game.rating?.toFixed(1)}</span>
                    <span className="text-slate-600 text-xs font-rajdhani">
                      {game.platforms?.slice(0,2).map(p => p.platform.name).join(' · ')}
                    </span>
                  </div>
                  <p className="text-slate-500 font-rajdhani text-sm mb-4 line-clamp-2">{game.description}</p>

                  <div className="flex gap-3">
                    {claimed ? (
                      <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded bg-[#00ff8811] border border-[#00ff8844] text-[#00ff88] font-orbitron text-xs">
                        <CheckCircle size={14} /> CLAIMED
                      </div>
                    ) : (
                      <button
                        onClick={() => claimFreeGame(game)}
                        className="flex-1 py-2.5 rounded font-orbitron text-xs font-700 tracking-wider transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #00ff88, #00b8d9)',
                          color: '#060610',
                        }}
                      >
                        🎁 CLAIM FREE
                      </button>
                    )}
                    <Link
                      to={`/game/${game.id}`}
                      className="btn-outline text-xs py-2.5 px-4"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-14">
        <h2 className="font-orbitron text-lg text-white mb-6">HOW IT WORKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Browse', desc: 'Check out the 3 free games available this week.' },
            { step: '02', title: 'Claim', desc: 'Click "Claim Free" while logged in before the timer runs out.' },
            { step: '03', title: 'Play Forever', desc: 'The game is added to your library permanently. No subscription needed.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-5 relative">
              <div className="font-orbitron text-4xl font-900 text-[#00ff8811] absolute top-3 right-4">{step}</div>
              <p className="font-mono-custom text-[#00ff88] text-xs mb-2">{step}</p>
              <h3 className="font-orbitron text-sm text-white mb-2">{title}</h3>
              <p className="text-slate-500 font-rajdhani text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-orbitron text-lg text-white">COMING UP NEXT</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#7c3aed33] to-transparent" />
          <span className="tag tag-purple text-[10px]">PREVIEW</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {UPCOMING.map(game => (
            <div key={game.id} className="game-card opacity-70">
              <div className="relative h-36 overflow-hidden">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-full object-cover filter blur-sm"
                />
                <div className="absolute inset-0 bg-[#060610]/60 flex items-center justify-center">
                  <span className="font-orbitron text-xs text-slate-400">COMING NEXT WEEK</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-orbitron text-xs text-slate-400">{game.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past free games */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-orbitron text-lg text-white">PREVIOUSLY FREE</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1e1e40] to-transparent" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PAST_FREE.map(game => (
            <div key={game.id} className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl overflow-hidden opacity-60">
              <div className="relative h-28">
                <img src={game.background_image} alt={game.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#060610]/50" />
                <span className="absolute top-2 left-2 tag tag-red text-[10px]">EXPIRED</span>
              </div>
              <div className="p-3">
                <p className="font-orbitron text-xs text-slate-500 line-clamp-1">{game.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-14 text-center">
        <p className="text-slate-500 font-rajdhani mb-4">Don't miss next week's free games!</p>
        <Link to="/store" className="btn-outline text-sm">
          Browse All Games <ChevronRight size={12} className="inline" />
        </Link>
      </div>
    </div>
  )
}
