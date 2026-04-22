import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Loader } from '../components/UI'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Signup() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)   // 1=form, 2=otp
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', role: 'contractor', business: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Step 1 — create account & send OTP
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name is required')
    if (form.phone.length !== 10) return toast.error('Enter a valid phone number')
    if (!form.business.trim()) return toast.error('Business name is required')
    setLoading(true)
    try {
      await authAPI.signup({ name: form.name, phone: form.phone, role: form.role, address: form.business })
      setStep(2)
      toast.success('Account created! Check Railway logs for your OTP.')
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — verify OTP and log in
  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length < 4) return toast.error('Enter the OTP')
    setLoading(true)
    try {
      const user = await authAPI.verifyOTP(form.phone, otp)
      login(user)
      toast.success(`Welcome, ${user.name}!`)
      navigate(`/${user.role}/dashboard`, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">B</div>
          <h1 className="text-2xl font-semibold text-white">Create account</h1>
          <p className="text-slate-500 text-sm mt-1">Join BuildMart today</p>
        </div>

        <div className="card">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">I am a</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'contractor', label: 'Contractor', icon: '👷' },
                    { id: 'dealer',     label: 'Dealer',     icon: '🏪' },
                  ].map(r => (
                    <button key={r.id} type="button" onClick={() => set('role', r.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                        form.role === r.id ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}>
                      <span>{r.icon}</span>
                      <span className="text-sm font-medium">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Full name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  className="input" placeholder="Rajesh Kumar" />
              </div>

              <div>
                <label className="label">Business / Company name</label>
                <input value={form.business} onChange={e => set('business', e.target.value)}
                  className="input" placeholder={form.role === 'contractor' ? 'RK Constructions' : 'Sharma Traders'} />
              </div>

              <div>
                <label className="label">Mobile number</label>
                <div className="flex gap-2">
                  <span className="input w-14 flex-shrink-0 text-slate-400 text-center">+91</span>
                  <input type="tel" maxLength={10} value={form.phone}
                    onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                    className="input flex-1" placeholder="9876543210" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                {loading ? <Loader size="sm" /> : null}
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-center text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <button type="button" onClick={() => setStep(1)} className="text-slate-500 text-sm hover:text-white mb-2">← Back</button>
                <h2 className="text-lg font-medium text-white">Verify your number</h2>
                <p className="text-slate-500 text-sm">OTP sent to +91 {form.phone}</p>
              </div>
              <div>
                <label className="label">One-time password</label>
                <input type="text" maxLength={6} value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="input text-center text-2xl tracking-[0.5em] font-mono" autoFocus />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader size="sm" /> : null}
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
