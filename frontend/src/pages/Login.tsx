import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      // Get the exact message from the backend (e.g., "Email is not registered")
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user starts typing again
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  // Helper to check if the error is related to email or password
  const isEmailError = error.toLowerCase().includes('email');
  const isPasswordError = error.toLowerCase().includes('password');

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-950 relative flex items-center justify-center px-4">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.20),_transparent_35%)]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute top-[18%] left-[15%] w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
        <div className="absolute top-[25%] right-[18%] w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
        <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
      </div>

      {/* Main */}
      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/30 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1px] shadow-xl shadow-indigo-500/30">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                <span className="text-3xl">📄</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-black text-white tracking-tight">
            AI{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Docs
            </span>
          </h1>
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 blur-sm" />
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl shadow-2xl shadow-black/50 p-6 sm:p-7">

            {/* Header */}
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-white">
                Welcome back
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Sign in to your account
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300 animate-shake">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9h.5"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    placeholder="you@example.com"
                    className={`w-full rounded-xl border px-4 pl-12 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:ring-4 ${
                      isEmailError
                        ? 'bg-red-950/30 border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10'
                        : 'bg-indigo-950/40 border-indigo-500/30 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                    onClick={() => {
                      const input = document.getElementById(
                        'login-password'
                      ) as HTMLInputElement | null;
                      if (input) {
                        input.type =
                          input.type === 'password'
                            ? 'text'
                            : 'password';
                      }
                    }}
                  >
                    Show
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter your password"
                    className={`w-full rounded-xl border px-4 pl-12 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:ring-4 ${
                      isPasswordError
                        ? 'bg-red-950/30 border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10'
                        : 'bg-indigo-950/40 border-indigo-500/30 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-600/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </button>

            </form>

            {/* Register */}
            <div className="mt-5 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-400 hover:text-purple-400 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Global Styles for Shake Animation */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default Login;