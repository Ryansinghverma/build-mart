import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Loader } from '../components/UI'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Login() {
  const { loginWithUser } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1=phone, 2=otp
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (phone.length !== 10) return toast.error('Enter a valid 10-digit number')
    setLoading(true)
    try {
      await authAPI.sendOTP(phone)
      setStep(2)
      toast.success('OTP sent to your number!')
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length < 4) return toast.error('Enter the OTP')
    setLoading(true)
    try {
      const userData = await authAPI.verifyOTP(phone, otp)
      const user = loginWithUser(userData)
      toast.success(`Welcome back, ${user.name}!`)
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">B</div>
          <h1 className="text-2xl font-semibold text-white">BuildMart</h1>
          <p className="text-slate-500 text-sm mt-1">B2B Construction Materials</p>
        </div>

        <div className="card">
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <h2 className="text-lg font-medium text-white mb-1">Sign in</h2>
                <p className="text-sm text-slate-500">Enter your phone number to continue</p>
              </div>

              <div>
                <label className="label">Mobile number</label>
                <div className="flex gap-2">
                  <span className="input w-14 flex-shrink-0 text-slate-400 text-center">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="input flex-1"
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader size="sm" /> : null}
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <p className="text-center text-xs text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-brand-400 hover:text-brand-300">Sign up</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <button type="button" onClick={() => setStep(1)} className="text-slate-500 text-sm hover:text-white mb-2">← Back</button>
                <h2 className="text-lg font-medium text-white">Enter OTP</h2>
                <p className="text-sm text-slate-500">Sent to +91 {phone}</p>
              </div>

              <div>
                <label className="label">One-time password</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="input text-center text-2xl tracking-[0.5em] font-mono"
                  autoFocus
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader size="sm" /> : null}
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
