import React, { useState } from 'react'
import {
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  Radio,
  ArrowRight,
  AlertCircle,
  Shield,
  Building,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface RegisterPageProps {
  onNavigateToLogin: () => void
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateToLogin }) => {
  const { register, isLoading } = useAuth()

  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [institution, setInstitution] = useState<string>('')
  const [designation, setDesignation] = useState<string>('')

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false)
  const [registeredEmail, setRegisteredEmail] = useState<string>('')

  // Simple password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' }
    let score = 0
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' }
    if (score <= 2) return { score, label: 'Fair', color: 'bg-amber-500' }
    if (score <= 3) return { score, label: 'Good', color: 'bg-blue-500' }
    return { score, label: 'Strong', color: 'bg-emerald-500' }
  }

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Validations
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid corporate or academic email address.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password fields.')
      return
    }

    if (!institution.trim()) {
      setErrorMessage('Please specify your Institution or Organization (e.g. BCCI, University, Partner).')
      return
    }

    setIsSubmitting(true)
    try {
      await register({
        email: email.trim().toLowerCase(),
        password,
        full_name: fullName.trim(),
        department: institution.trim() + (designation.trim() ? ` - ${designation.trim()}` : ''),
        // Public registrations strictly receive EXECUTIVE_VIEWER
        role: 'EXECUTIVE_VIEWER',
      })

      setRegisteredEmail(email.trim())
      setRegistrationSuccess(true)
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please verify your details or use a different email.'
      setErrorMessage(detail)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070A13] text-white flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#131B2E15_1px,transparent_1px),linear-gradient(to_bottom,#131B2E15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl relative z-10">
        <div className="rounded-3xl bg-[#0B0F19]/90 border border-slate-800/90 shadow-2xl shadow-red-950/20 backdrop-blur-xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E40000] to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-900/40 border border-red-500/30">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#E40000] font-black text-base tracking-tight">AIRTEL</span>
                    <span className="text-white font-extrabold text-base">STADIUM360</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                    Predict. Optimize. Connect.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Observer & Partner Registration</h2>
              <p className="text-xs text-slate-400 pt-0.5">
                Register an account to inspect stadium network KPIs, capacity metrics, and audit reports
              </p>
            </div>

            {/* Security Clearance Policy Notice */}
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-300 text-xs flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold text-white">NOC Security Policy: </span>
                All public registrations are automatically provisioned with{' '}
                <span className="font-mono font-bold text-blue-300">EXECUTIVE_VIEWER</span> clearance.
                Elevated roles (<span className="text-emerald-300 font-semibold">TELECOM_ENGINEER</span> /{' '}
                <span className="text-red-300 font-semibold">NETWORK_ADMIN</span>) can only be granted
                by an authorized NOC Director.
              </div>
            </div>
          </div>

          {/* Success State View */}
          {registrationSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Registration Successful!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Account created for <span className="text-white font-semibold">{fullName}</span> (
                  <span className="text-emerald-400 font-mono">{registeredEmail}</span>).
                </p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-500/40 text-blue-300 font-mono text-[10px] font-bold">
                  Assigned Clearance: EXECUTIVE_VIEWER (Read-Only)
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                You can now log in using your registered credentials.
              </p>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-[#FF4D4D] flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Ramesh Kulkarni"
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#070A13] border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Official Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Official Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="ramesh@organization.org"
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#070A13] border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Institution & Designation (Two Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Institution / Org *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        required
                        placeholder="e.g. BCCI / NIT Delhi"
                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#070A13] border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Designation <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Match Auditor"
                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#070A13] border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password (Two Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Password (min 8) *</label>
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
                        className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#070A13] border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Confirm Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#070A13] border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Password Strength:</span>
                      <span className="font-semibold text-slate-300">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full ${strength.color} transition-all`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E40000] to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Observer Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Already Have an Account Link */}
              <div className="text-center pt-2 border-t border-slate-800/60">
                <p className="text-xs text-slate-400">
                  Already registered with Airtel Stadium360?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="text-red-400 hover:text-red-300 font-bold underline transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

