import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, UserPlus, Check } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Signup() {
  const { signup } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }

  const strength = passwordStrength(form.password)
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', '#ef4444', '#f59e0b', '#00f5ff', '#00ff88']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = signup(form.name, form.email, form.password)
    setLoading(false)
    if (result.success) navigate('/')
    else setError(result.error)
  }

  const perks = [
    'Access to weekly free games',
    'Personalized recommendations',
    'Library & wishlist sync',
    'Exclusive member discounts',
  ]

  return (
    <div className="min-h-screen bg-[#060610] bg-grid flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#f0249a] opacity-4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#7c3aed] opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left panel - perks */}
        <div className="hidden md:block">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#00f5ff] flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-orbitron font-800 text-lg tracking-widest neon-cyan">NEXUSPLAY</span>
          </Link>

          <h2 className="font-orbitron text-3xl font-900 text-white mb-3 leading-tight">
            JOIN THE<br /><span className="gradient-text">NEXUS</span>
          </h2>
          <p className="text-slate-400 font-rajdhani text-lg mb-8">
            Create your account and start your gaming journey today.
          </p>

          <div className="space-y-3">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#00ff8822] border border-[#00ff8844] flex items-center justify-center shrink-0">
                  <Check size={12} className="text-[#00ff88]" />
                </div>
                <span className="text-slate-300 font-rajdhani">{perk}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-xl bg-gradient-to-br from-[#7c3aed11] to-[#00f5ff11] border border-[#7c3aed33]">
            <p className="font-orbitron text-xs text-[#a78bfa] mb-1">NEW MEMBER BONUS</p>
            <p className="text-white font-rajdhani">Use code <span className="font-mono-custom text-[#00f5ff] font-700">NEWUSER</span> for 15% off your first purchase!</p>
          </div>
        </div>

        {/* Right panel - form */}
        <div>
          <div className="text-center mb-6 md:hidden">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#00f5ff] flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-orbitron text-sm tracking-widest neon-cyan">NEXUSPLAY</span>
            </Link>
            <h1 className="font-orbitron text-2xl font-700 text-white">CREATE ACCOUNT</h1>
          </div>

          <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-2xl p-7">
            <h2 className="font-orbitron text-lg text-white mb-5 hidden md:block">CREATE ACCOUNT</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 text-red-400 text-sm font-rajdhani">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-orbitron text-xs text-slate-400 mb-1.5 tracking-wider">USERNAME</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  placeholder="CyberGamer42"
                  required
                />
              </div>

              <div>
                <label className="block font-orbitron text-xs text-slate-400 mb-1.5 tracking-wider">EMAIL</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block font-orbitron text-xs text-slate-400 mb-1.5 tracking-wider">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength ? strengthColors[strength] : '#1e1e40' }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-rajdhani" style={{ color: strengthColors[strength] }}>
                      {strengthLabels[strength]}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-orbitron text-xs text-slate-400 mb-1.5 tracking-wider">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  className={`input-field ${form.confirm && form.confirm !== form.password ? 'border-red-700' : ''}`}
                  placeholder="••••••••"
                  required
                />
                {form.confirm && form.confirm !== form.password && (
                  <p className="text-red-400 text-xs mt-1 font-rajdhani">Passwords don't match</p>
                )}
              </div>

              <p className="text-slate-600 text-xs font-rajdhani">
                By creating an account you agree to our{' '}
                <a href="#" className="text-[#7c3aed] hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#7c3aed] hover:underline">Privacy Policy</a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary py-3.5 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus size={14} /> Create Account
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 font-rajdhani text-sm mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-[#00f5ff] hover:text-white transition-colors font-600">
                Sign In
              </Link>
            </p>
          </div>

          <p className="text-center text-slate-700 text-xs font-mono-custom mt-4">
            <Link to="/" className="hover:text-slate-500 transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
