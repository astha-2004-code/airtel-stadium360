import React, { useState } from 'react'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Radio,
  ArrowRight,
  AlertCircle,
  Shield,
  Wrench,
  Activity,
  CheckCircle2,
  Sparkles,
  Wifi,
  Zap,
  HelpCircle,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types/auth'

interface LoginPageProps {
  onNavigateToRegister: () => void
  onLoginSuccess?: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToRegister,
  onLoginSuccess,
}) => {
  const { login, quickSwitchDemo, isLoading } = useAuth()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage('Please enter your corporate email address.')
      return
    }
    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      if (rememberMe) {
        localStorage.setItem('airtel_remembered_email', email.trim())
      } else {
        localStorage.removeItem('airtel_remembered_email')
      }
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'Authentication failed. Please verify your email and password.'
      setErrorMessage(detail)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoSelect = async (demoEmail: string) => {
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      await quickSwitchDemo(demoEmail)
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo persona login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pre-fill remembered email if saved
  React.useEffect(() => {
    const saved = localStorage.getItem('airtel_remembered_email')
    if (saved) {
      setEmail(saved)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#070A13] text-white flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      {/* Background Ambience: Subtle red radial gradient & cyber grid */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#131B2E15_1px,transparent_1px),linear-gradient(to_bottom,#131B2E15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Hero Branding Column (Visible on Desktop) */}
        <div className="lg:col-span-6 space-y-6 hidden lg:block pr-4">
          {/* Logo Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wide shadow-lg shadow-red-950/40">
            <span className="w-2 h-2 rounded-full bg-[#E40000] animate-pulse" />
            <span>AIRTEL 5G PRIVATE NOC • STADIUM360</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
              Predict. Optimize. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E40000] via-red-500 to-amber-400">
                Connect.
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              AI-driven telecom orchestration for 120,000 peak spectators at Narendra Modi Stadium.
              Real-time capacity forecasting, 64T64R beam steering, and sub-10ms UPI payment slice
              guarantee.
            </p>
          </div>

          {/* Stadium 360 Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0E1526]/80 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Wifi className="w-4 h-4" />
                <span>Massive MIMO</span>
              </div>
              <p className="text-[11px] text-slate-400">8 Macro Sites + 26 Small Cells</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0E1526]/80 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Zap className="w-4 h-4" />
                <span>UPI QoS Slice</span>
              </div>
              <p className="text-[11px] text-slate-400">99.99% Reliability Guarantee</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0E1526]/80 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                <Radio className="w-4 h-4" />
                <span>Digital Twin</span>
              </div>
              <p className="text-[11px] text-slate-400">Live 3D RF Topology Telemetry</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0E1526]/80 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                <Shield className="w-4 h-4" />
                <span>Strict RBAC</span>
              </div>
              <p className="text-[11px] text-slate-400">Admin, Engineer & Viewer Personas</p>
            </div>
          </div>

          {/* Competition Badge */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Airtel SYNC Competition 2026
            </span>
            <span className="font-mono text-slate-500">NIT Delhi Team</span>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="rounded-3xl bg-[#0B0F19]/90 border border-slate-800/90 shadow-2xl shadow-red-950/20 backdrop-blur-xl p-6 sm:p-8 space-y-6">
            {/* Header / Brand */}
            <div className="space-y-2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E40000] to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-900/40 border border-red-500/30">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#E40000] font-black text-lg tracking-tight">AIRTEL</span>
                    <span className="text-white font-extrabold text-lg">STADIUM360</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                    Network Operations Centre
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">NOC Identity Sign In</h2>
                <p className="text-xs text-slate-400">
                  Enter your enterprise credentials to access the 5G command system
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-[#FF4D4D] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Corporate Email</span>
                  <span className="text-[10px] text-slate-500">e.g. admin@airtel.com</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@airtel.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070A13] border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#070A13] border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-[#070A13] text-[#E40000] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#E40000]"
                  />
                  <span className="text-xs text-slate-400">Remember on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E40000] to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating NOC Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Stadium360</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-1 border-t border-slate-800/60">
              <p className="text-xs text-slate-400">
                Don't have an enterprise account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="text-red-400 hover:text-red-300 font-bold underline transition-colors"
                >
                  Register as Guest / Observer
                </button>
              </p>
            </div>

            {/* 1-Click Evaluation Personas for Competition Judges */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Judge 1-Click Evaluation Personas
                </span>
                <span className="text-[9px] text-slate-500">Auto-Fill & Sign In</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Admin Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoSelect('admin@airtel.com')}
                  disabled={isSubmitting}
                  className="p-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/50 border border-red-500/30 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      ADMIN
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-1">
                    <div className="text-xs font-bold text-white truncate">Sunil Varma</div>
                    <div className="text-[9px] text-slate-400 truncate">admin@airtel.com</div>
                  </div>
                </button>

                {/* Engineer Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoSelect('engineer@airtel.com')}
                  disabled={isSubmitting}
                  className="p-2.5 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/50 border border-emerald-500/30 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <Wrench className="w-3 h-3" />
                      ENGINEER
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-1">
                    <div className="text-xs font-bold text-white truncate">Priya Sharma</div>
                    <div className="text-[9px] text-slate-400 truncate">engineer@airtel.com</div>
                  </div>
                </button>

                {/* Viewer Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoSelect('viewer@airtel.com')}
                  disabled={isSubmitting}
                  className="p-2.5 rounded-xl bg-blue-950/20 hover:bg-blue-950/50 border border-blue-500/30 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      VIEWER
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-1">
                    <div className="text-xs font-bold text-white truncate">BCCI Observer</div>
                    <div className="text-[9px] text-slate-400 truncate">viewer@airtel.com</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span>NOC Security & Password Policy</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                In compliance with Airtel Stadium360 corporate security guidelines, password resets
                require verification by the <strong>Airtel NOC Security Directorate</strong>.
              </p>
              <div className="p-3 rounded-xl bg-[#070A13] border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="text-slate-400">NOC Admin Contact:</div>
                <div className="text-red-400 font-bold">admin@airtel.com</div>
              </div>
              <p className="text-slate-400 text-[11px]">
                For competition judging and testing, use the <strong>1-Click Personas</strong> on the login
                page to test Network Admin, Telecom Engineer, or Executive Viewer accounts.
              </p>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Return to Login
            </button>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <footer className="mt-8 text-center text-xs text-slate-500 font-mono">
        Airtel Stadium360 • Predict. Optimize. Connect. • NIT Delhi Team
      </footer>
    </div>
  )
}

