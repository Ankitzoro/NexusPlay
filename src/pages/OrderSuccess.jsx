import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, BookOpen, ShoppingBag, Gamepad2 } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function OrderSuccess() {
  const { lastOrder, library } = useStore()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Glow circle */}
      <div className="relative inline-block mb-8">
        <div className="w-24 h-24 rounded-full bg-[#00ff8811] border border-[#00ff8844] flex items-center justify-center mx-auto animate-pulse-glow">
          <CheckCircle size={48} className="text-[#00ff88]" />
        </div>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({length: 12}).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-float"
                style={{
                  background: ['#00ff88', '#7c3aed', '#f0249a', '#00f5ff'][i % 4],
                  left: `${(i * 30) % 100}%`,
                  top: `${(i * 25) % 80}%`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <h1 className="font-orbitron text-3xl font-900 text-white mb-2">ORDER COMPLETE!</h1>
      <p className="font-orbitron text-sm neon-cyan mb-2 tracking-widest">
        {lastOrder?.orderId || 'NXP-DEMO001'}
      </p>
      <p className="text-slate-400 font-rajdhani text-lg mb-8">
        Your games have been added to your library. Enjoy playing!
      </p>

      {/* Order details */}
      {lastOrder && (
        <div className="bg-[#0d0d1f] border border-[#00ff8833] rounded-xl p-6 mb-8 text-left">
          <h2 className="font-orbitron text-xs text-[#00ff88] mb-4 tracking-wider">ORDER DETAILS</h2>
          <div className="space-y-2">
            {lastOrder.items?.map(item => (
              <div key={item.id} className="flex justify-between font-rajdhani text-sm">
                <span className="text-slate-300">{item.name}</span>
                <span className="text-[#00ff88]">
                  ${item.discount ? (item.price * (1 - item.discount/100)).toFixed(2) : item.price?.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="h-px bg-[#1e1e40] my-2" />
            <div className="flex justify-between font-orbitron text-sm">
              <span className="text-white">TOTAL PAID</span>
              <span className="neon-cyan">${lastOrder.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-lg p-4">
          <Gamepad2 size={24} className="neon-purple mx-auto mb-2" />
          <p className="font-orbitron text-xs text-white">{library.length} GAMES</p>
          <p className="text-slate-500 text-xs font-rajdhani">In Library</p>
        </div>
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-lg p-4">
          <CheckCircle size={24} className="text-[#00ff88] mx-auto mb-2" />
          <p className="font-orbitron text-xs text-white">INSTANT</p>
          <p className="text-slate-500 text-xs font-rajdhani">Delivery</p>
        </div>
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-lg p-4">
          <BookOpen size={24} className="neon-cyan mx-auto mb-2" />
          <p className="font-orbitron text-xs text-white">LIFETIME</p>
          <p className="text-slate-500 text-xs font-rajdhani">Access</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/library" className="btn-primary text-sm py-3 px-8">
          <BookOpen size={14} className="inline mr-2" /> View Library
        </Link>
        <Link to="/store" className="btn-outline text-sm py-3 px-8">
          <ShoppingBag size={14} className="inline mr-2" /> Continue Shopping
        </Link>
      </div>
    </div>
  )
}
