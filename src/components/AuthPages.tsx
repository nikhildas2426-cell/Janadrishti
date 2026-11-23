import React, { useState } from 'react';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert,
  UserPlus,
  X,
} from 'lucide-react';
import {
  CONSTITUENCIES,
  DEFAULT_DEMO_CITIZEN,
  DEMO_CITIZEN_CREDENTIALS,
} from '../data/karnatakaData';
import { CitizenUser, ConstituencyId, PageId } from '../types/jandrishti';

interface AuthPagesProps {
  mode: 'login' | 'register';
  onSwitchMode: (page: PageId) => void;
  onLoginSuccess: (user: CitizenUser) => void;
}

export default function AuthPages({
  mode,
  onSwitchMode,
  onLoginSuccess,
}: AuthPagesProps) {
  // Login state
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regVoterId, setRegVoterId] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regConstituency, setRegConstituency] =
    useState<ConstituencyId>('mangaluru');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const trimmedId = voterId.trim().toUpperCase();
    if (!trimmedId || !password) {
      setLoginError('Please enter the fictional demo Voter ID and password.');
      return;
    }

    if (
      trimmedId === DEMO_CITIZEN_CREDENTIALS.voterId &&
      password === DEMO_CITIZEN_CREDENTIALS.password
    ) {
      onLoginSuccess(DEFAULT_DEMO_CITIZEN);
      return;
    }

    setLoginError(
      `Invalid demo credentials. Use Demo Voter ID "${DEMO_CITIZEN_CREDENTIALS.voterId}" and Password "${DEMO_CITIZEN_CREDENTIALS.password}", or create a sample account.`
    );
  };

  const handleFillDemo = () => {
    setVoterId(DEMO_CITIZEN_CREDENTIALS.voterId);
    setPassword(DEMO_CITIZEN_CREDENTIALS.password);
    setLoginError('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (regPassword.length < 6) {
      setRegError('Demo password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError('Password and Confirm Password do not match.');
      return;
    }

    const area = CONSTITUENCIES.find((c) => c.id === regConstituency);
    onLoginSuccess({
      fullName: regName.trim() || 'Demo Citizen',
      voterId: regVoterId.trim().toUpperCase() || 'DEMO-USER-001',
      mobile: regMobile.trim() || '+91 90000 00000',
      email: regEmail.trim() || 'citizen.demo@example.org',
      constituencyId: regConstituency,
      wardOrLocality: `${area?.localities[0] || 'Central Ward'}, ${area?.name || 'Karnataka'}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl mx-auto space-y-5">
        {/* Mandatory Prototype Warning */}
        <div className="p-4 rounded-xl bg-[#E5A93D]/12 border border-[#E5A93D]/40 flex items-start gap-3 text-xs text-[#102A43]">
          <ShieldAlert className="w-5 h-5 text-[#9A6B16] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-display font-bold text-sm">
              Frontend Prototype Only — Simulated Authentication
            </p>
            <p className="text-[#334E68] leading-relaxed">
              JanDrishti does not connect to Election Commission databases or verify real
              Voter IDs.{' '}
              <strong>
                Do not enter real Voter ID numbers, government passwords, or sensitive
                personal details.
              </strong>
            </p>
          </div>
        </div>

        {mode === 'login' ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-[#102A43]">
                Citizen Login (Demo Prototype)
              </h1>
              <p className="text-sm text-[#486581] mt-1">
                Sign in with fictional demo credentials to view a personalized constituency
                dashboard.
              </p>
            </div>

            {/* Demo Credentials Helper Box */}
            <div className="mb-6 p-4 rounded-lg bg-[#F4F8FA] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-[#102A43]">Fictional Demo Credentials</p>
                <p className="text-[#334E68] mt-0.5">
                  Voter ID:{' '}
                  <code className="font-mono font-semibold text-[#087E8B]">
                    {DEMO_CITIZEN_CREDENTIALS.voterId}
                  </code>{' '}
                  · Password:{' '}
                  <code className="font-mono font-semibold text-[#087E8B]">
                    {DEMO_CITIZEN_CREDENTIALS.password}
                  </code>
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-3 py-1.5 bg-[#102A43] hover:bg-[#1D3E5E] text-white font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
              >
                Fill Demo Credentials
              </button>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-[#B91C1C]/8 border border-[#B91C1C]/25 text-xs text-[#B91C1C] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Voter ID Number (Demo ID Only)
                </label>
                <input
                  type="text"
                  required
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  placeholder="e.g., KRN-DEMO-4821"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono text-sm focus:outline-none focus:border-[#087E8B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Password (Demo Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter demo password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-[#102A43] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-[#334E68] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#087E8B]"
                  />
                  <span>Remember Me (Session Only)</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotSent(false);
                    setForgotModalOpen(true);
                  }}
                  className="font-semibold text-[#087E8B] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Login to Citizen Dashboard</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs text-[#334E68]">
              New to the prototype?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className="font-semibold text-[#087E8B] hover:underline cursor-pointer"
              >
                Create Account (Demo)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-[#102A43]">
                Create Citizen Account (Demo Prototype)
              </h1>
              <p className="text-sm text-[#486581] mt-1">
                Simulate citizen onboarding with sample details to personalize your
                constituency view.
              </p>
            </div>

            {regError && (
              <div className="mb-4 p-3 rounded-lg bg-[#B91C1C]/8 border border-[#B91C1C]/25 text-xs text-[#B91C1C]">
                {regError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g., Priya Shetty (Demo)"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Voter ID Number (Fictional / Demo)
                  </label>
                  <input
                    type="text"
                    required
                    value={regVoterId}
                    onChange={(e) => setRegVoterId(e.target.value)}
                    placeholder="e.g., DEMO-KA-1029"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 font-mono text-sm focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Mobile Number (Demo)
                  </label>
                  <input
                    type="tel"
                    required
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="citizen.demo@example.org"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Select Sample Constituency
                </label>
                <select
                  value={regConstituency}
                  onChange={(e) =>
                    setRegConstituency(e.target.value as ConstituencyId)
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:border-[#087E8B]"
                >
                  {CONSTITUENCIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.constituencyName} ({c.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-3.5 pr-9 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                    <button
                      type="button"
                      onClick={() => setRegShowPassword((v) => !v)}
                      aria-label={regShowPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
                    >
                      {regShowPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={regShowPassword ? 'text' : 'password'}
                    required
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#102A43] hover:bg-[#1D3E5E] text-white font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Demo Account & Open Dashboard</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs text-[#334E68]">
              Already have demo credentials?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className="font-semibold text-[#087E8B] hover:underline cursor-pointer"
              >
                Back to Citizen Login
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Simulated Modal */}
      {forgotModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold text-[#102A43]">
                Forgot Password (Simulated)
              </h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSent ? (
              <div className="space-y-3 text-sm text-[#334E68]">
                <p className="text-[#27966D] font-semibold">
                  Prototype Reset Notice
                </p>
                <p>
                  Because this is a frontend prototype, no real email or SMS is sent. Use
                  demo Voter ID{' '}
                  <code className="font-mono font-semibold text-[#102A43]">
                    {DEMO_CITIZEN_CREDENTIALS.voterId}
                  </code>{' '}
                  and password{' '}
                  <code className="font-mono font-semibold text-[#102A43]">
                    {DEMO_CITIZEN_CREDENTIALS.password}
                  </code>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleFillDemo();
                    setForgotModalOpen(false);
                  }}
                  className="w-full py-2 bg-[#087E8B] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Apply Demo Credentials & Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSent(true);
                }}
                className="space-y-3 text-sm"
              >
                <p className="text-xs text-[#486581]">
                  Enter your demo Voter ID or email to view reset instructions.
                </p>
                <input
                  type="text"
                  required
                  placeholder="Demo Voter ID or Email"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#102A43] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Simulate Reset Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
