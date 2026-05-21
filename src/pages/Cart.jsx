import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart, ArrowRight, Tag, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useState } from 'react'

export default function Cart() {
  const {
    cart, removeFromCart, cartTotal, discountedTotal,
    appliedCoupon, applyCoupon, removeCoupon, isAuthenticated
  } = useStore()
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput)
    if (result.success) {
      setCouponSuccess(`${result.discount}% discount applied!`)
      setCouponError('')
    } else {
      setCouponError(result.error)
      setCouponSuccess('')
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (cart.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <ShoppingCart size={64} className="text-slate-700 mx-auto mb-4" />
      <h2 className="font-orbitron text-2xl text-slate-500 mb-3">YOUR CART IS EMPTY</h2>
      <p className="text-slate-600 font-rajdhani mb-6">Add some games to get started</p>
      <Link to="/store" className="btn-primary">Browse Store</Link>
    </div>
  )

  const savings = cartTotal - discountedTotal + cart.reduce((s, i) => {
    const orig = i.price
    const disc = i.discount ? i.price * (1 - i.discount/100) : i.price
    return s + (orig - disc)
  }, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-orbitron text-2xl font-700 gradient-text mb-8">YOUR CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => {
            const finalPrice = item.discount ? item.price * (1 - item.discount/100) : item.price
            return (
              <div key={item.id} className="flex gap-4 p-4 bg-[#0d0d1f] border border-[#1e1e40] rounded-xl hover:border-[#7c3aed33] transition-colors">
                <img
                  src={item.background_image}
                  alt={item.name}
                  className="w-24 h-16 rounded object-cover shrink-0"
                  onError={e => e.target.src = 'https://via.placeholder.com/96x64/12122a/7c3aed?text=Game'}
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/game/${item.id}`} className="font-orbitron text-sm text-white hover:neon-cyan transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <div className="flex gap-1 mt-1">
                    {item.genres?.slice(0,2).map(g => <span key={g.name} className="tag tag-purple text-[10px]">{g.name}</span>)}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-orbitron text-sm font-700 neon-cyan">${finalPrice.toFixed(2)}</span>
                    {item.discount > 0 && (
                      <>
                        <span className="price-original font-rajdhani text-xs">${item.price.toFixed(2)}</span>
                        <span className="tag tag-pink text-[10px]">-{item.discount}%</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 rounded hover:bg-red-900/20 transition-colors text-slate-500 hover:text-red-400 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-5">
            <h3 className="font-orbitron text-xs text-slate-400 mb-3 tracking-wider flex items-center gap-2">
              <Tag size={12} /> COUPON CODE
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-[#00ff8811] border border-[#00ff8833] rounded p-3">
                <div>
                  <p className="font-mono-custom text-[#00ff88] text-sm font-700">{appliedCoupon.code}</p>
                  <p className="text-[#00ff88] text-xs font-rajdhani">{appliedCoupon.discount}% discount applied!</p>
                </div>
                <button onClick={() => { removeCoupon(); setCouponSuccess(''); }} className="text-slate-500 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code..."
                    className="input-field text-sm py-2 font-mono-custom"
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button onClick={handleApplyCoupon} className="btn-primary text-xs px-3 py-2 shrink-0">Apply</button>
                </div>
                {couponError && <p className="text-red-400 text-xs font-rajdhani">{couponError}</p>}
                {couponSuccess && <p className="text-[#00ff88] text-xs font-rajdhani">{couponSuccess}</p>}
                <p className="text-slate-600 text-xs font-mono-custom">Try: NEXUS20 · GAMER50 · NEWUSER</p>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-5">
            <h3 className="font-orbitron text-xs text-slate-400 mb-4 tracking-wider">ORDER SUMMARY</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-rajdhani text-sm">
                <span className="text-slate-400">Subtotal ({cart.length} items)</span>
                <span className="text-white">${cartTotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between font-rajdhani text-sm">
                  <span className="text-[#00ff88]">Coupon ({appliedCoupon.code})</span>
                  <span className="text-[#00ff88]">-{appliedCoupon.discount}%</span>
                </div>
              )}
              <div className="h-px bg-[#1e1e40]" />
              <div className="flex justify-between">
                <span className="font-orbitron text-sm text-white">TOTAL</span>
                <span className="font-orbitron text-xl font-700 neon-cyan">${discountedTotal.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <p className="text-[#00ff88] text-xs font-rajdhani text-right">You save ${savings.toFixed(2)}!</p>
              )}
            </div>

            <button onClick={handleCheckout} className="w-full btn-primary text-sm py-3">
              Proceed to Checkout <ArrowRight size={14} className="inline ml-1" />
            </button>

            <p className="text-slate-600 text-xs font-mono-custom text-center mt-3">
              🔒 Secure checkout
            </p>
          </div>

          <Link to="/store" className="block text-center text-slate-500 hover:text-slate-200 text-sm font-rajdhani transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
