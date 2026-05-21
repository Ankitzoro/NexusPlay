import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, LogIn } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Login() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#060610] bg-grid flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7c3aed] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00f5ff] opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#00f5ff] flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-orbitron font-800 text-lg tracking-widest neon-cyan">NEXUSPLAY</span>
          </Link>
          <h1 className="font-orbitron text-2xl font-700 text-white mb-2">WELCOME BACK</h1>
          <p className="text-slate-500 font-rajdhani">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 text-red-400 text-sm font-rajdhani">
                {error}
              </div>
            )}

            <div>
              <label className="block font-orbitron text-xs text-slate-400 mb-2 tracking-wider">EMAIL</label>
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
              <label className="block font-orbitron text-xs text-slate-400 mb-2 tracking-wider">PASSWORD</label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <button type="button" className="text-xs text-[#7c3aed] hover:text-[#a78bfa] font-rajdhani transition-colors">
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary py-3.5 text-sm mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={14} /> Sign In
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1e1e40]" />
            <span className="text-slate-600 text-xs font-mono-custom">OR</span>
            <div className="flex-1 h-px bg-[#1e1e40]" />
          </div>

          {/* Demo login hint */}
          <div className="bg-[#12122a] border border-[#7c3aed33] rounded-lg p-3 mb-4">
            <p className="text-[#a78bfa] text-xs font-orbitron mb-1">DEMO CREDENTIALS</p>
            <p className="text-slate-400 text-xs font-mono-custom">Email: demo@nexusplay.gg</p>
            <p className="text-slate-400 text-xs font-mono-custom">Password: demo123</p>
            <button
              onClick={() => setForm({ email: 'demo@nexusplay.gg', password: 'demo123' })}
              className="mt-2 text-xs text-[#7c3aed] hover:text-[#a78bfa] font-rajdhani transition-colors underline"
            >
              Auto-fill demo credentials
            </button>
          </div>

          <p className="text-center text-slate-500 font-rajdhani text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#00f5ff] hover:text-white transition-colors font-600">
              Sign Up
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-700 text-xs font-mono-custom mt-6">
          <Link to="/" className="hover:text-slate-500 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
