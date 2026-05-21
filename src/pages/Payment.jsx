import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CreditCard, Lock, ArrowLeft, Smartphone, Building } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const { purchaseCart, cart, discountedTotal, appliedCoupon } = useStore()
  const [method, setMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [upi, setUpi] = useState('')
  const [errors, setErrors] = useState({})

  const total = location.state?.total || discountedTotal

  const formatCard = (val) => val.replace(/\D/g, '').slice(0,16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4)
    return d.length >= 2 ? d.slice(0,2) + '/' + d.slice(2) : d
  }

  const validate = () => {
    const errs = {}
    if (method === 'card') {
      if (card.number.replace(/\s/g,'').length < 16) errs.number = 'Enter 16-digit card number'
      if (!card.name) errs.name = 'Required'
      if (card.expiry.length < 5) errs.expiry = 'Enter valid expiry'
      if (card.cvv.length < 3) errs.cvv = 'Enter 3-digit CVV'
    } else if (method === 'upi') {
      if (!upi.includes('@')) errs.upi = 'Enter valid UPI ID'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePay = async () => {
    if (!validate()) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 2200)) // Simulate processing
    purchaseCart({
      items: cart,
      total,
      method,
      date: new Date().toISOString(),
      orderId: 'NXP-' + Math.random().toString(36).slice(2,10).toUpperCase(),
    })
    navigate('/order-success')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/checkout')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-rajdhani transition-colors">
        <ArrowLeft size={16} /> Back to Checkout
      </button>

      <h1 className="font-orbitron text-2xl font-700 gradient-text mb-8">PAYMENT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Payment method selection */}
          <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-5">
            <h2 className="font-orbitron text-sm text-white mb-4 tracking-wider">SELECT PAYMENT METHOD</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', icon: CreditCard, label: 'Card' },
                { id: 'upi', icon: Smartphone, label: 'UPI' },
                { id: 'netbanking', icon: Building, label: 'Net Banking' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    method === id
                      ? 'border-[#7c3aed] bg-[#7c3aed11] text-[#a78bfa]'
                      : 'border-[#1e1e40] text-slate-400 hover:border-[#7c3aed44]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-orbitron text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card form */}
          {method === 'card' && (
            <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-6">
              <h2 className="font-orbitron text-sm text-white mb-5 tracking-wider">CARD DETAILS</h2>

              {/* Visual card */}
              <div className="relative h-44 rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#5b21b6] to-[#1e1040] p-5 mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-scan opacity-20" />
                <div className="absolute top-3 right-5 font-orbitron text-xs text-white/60 tracking-widest">NEXUSPLAY</div>
                <div className="absolute bottom-14 left-5">
                  <p className="font-mono-custom text-white text-lg tracking-widest">
                    {card.number || '•••• •••• •••• ••••'}
                  </p>
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex justify-between">
                  <div>
                    <p className="text-white/60 text-[10px] font-orbitron">CARDHOLDER</p>
                    <p className="text-white text-sm font-orbitron">{card.name || 'YOUR NAME'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-[10px] font-orbitron">EXPIRES</p>
                    <p className="text-white text-sm font-orbitron">{card.expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">CARD NUMBER</label>
                  <input
                    value={card.number}
                    onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                    className="input-field font-mono-custom"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.number && <p className="text-red-400 text-xs mt-1">{errors.number}</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">CARDHOLDER NAME</label>
                  <input
                    value={card.name}
                    onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                    className="input-field"
                    placeholder="JOHN DOE"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">EXPIRY DATE</label>
                    <input
                      value={card.expiry}
                      onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                      className="input-field font-mono-custom"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">CVV</label>
                    <input
                      value={card.cvv}
                      onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,'').slice(0,3) }))}
                      type="password"
                      className="input-field font-mono-custom"
                      placeholder="•••"
                      maxLength={3}
                    />
                    {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* UPI */}
          {method === 'upi' && (
            <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-6">
              <h2 className="font-orbitron text-sm text-white mb-5 tracking-wider">UPI PAYMENT</h2>
              <div>
                <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">UPI ID</label>
                <input
                  value={upi}
                  onChange={e => setUpi(e.target.value)}
                  className="input-field font-mono-custom"
                  placeholder="yourname@upi"
                />
                {errors.upi && <p className="text-red-400 text-xs mt-1">{errors.upi}</p>}
              </div>
              <div className="mt-4 p-4 rounded-lg bg-[#12122a] border border-[#1e1e40] text-center">
                <p className="text-slate-400 font-rajdhani text-sm">Supported: GPay, PhonePe, Paytm, BHIM</p>
              </div>
            </div>
          )}

          {/* Net Banking */}
          {method === 'netbanking' && (
            <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-6">
              <h2 className="font-orbitron text-sm text-white mb-5 tracking-wider">SELECT BANK</h2>
              <div className="grid grid-cols-2 gap-3">
                {['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak', 'PNB'].map(bank => (
                  <button key={bank} className="p-3 rounded bg-[#12122a] border border-[#1e1e40] hover:border-[#7c3aed44] text-slate-300 font-rajdhani text-sm text-left transition-colors">
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary + Pay button */}
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-5 h-fit">
          <h3 className="font-orbitron text-xs text-slate-400 mb-4 tracking-wider">PAYMENT SUMMARY</h3>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm font-rajdhani">
              <span className="text-slate-400">Items ({cart.length})</span>
              <span>${(total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-rajdhani">
              <span className="text-slate-400">Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-sm font-rajdhani">
              <span className="text-slate-400">Delivery</span>
              <span className="text-[#00ff88]">Free (Digital)</span>
            </div>
            <div className="h-px bg-[#1e1e40]" />
            <div className="flex justify-between">
              <span className="font-orbitron text-sm text-white">TOTAL</span>
              <span className="font-orbitron text-xl font-700 neon-cyan">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className={`w-full btn-primary py-3.5 text-sm mt-2 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock size={14} /> Pay ${total.toFixed(2)}
              </span>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-3 text-slate-600 text-xs font-mono-custom">
            <Lock size={10} /> 256-bit SSL encrypted
          </div>
        </div>
      </div>
    </div>
  )
}
