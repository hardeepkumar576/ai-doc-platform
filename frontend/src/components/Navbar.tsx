import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-indigo-600'
        : 'text-gray-600 hover:text-indigo-600'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 group"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
            <span className="text-lg">📄</span>
          </span>
          <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            AI Docs
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {user && (
            <>
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg ${linkClass('/dashboard')} ${
                  isActive('/dashboard') ? 'bg-indigo-50' : 'hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/search"
                className={`px-3 py-2 rounded-lg ${linkClass('/search')} ${
                  isActive('/search') ? 'bg-indigo-50' : 'hover:bg-gray-50'
                }`}
              >
                Search
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg ${linkClass('/admin')} ${
                    isActive('/admin') ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                >
                  Admin
                </Link>
              )}

              <div className="w-px h-6 bg-gray-200 mx-2" />

              {/* User chip */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-full pl-1 pr-3 py-1">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-bold uppercase">
                  {user.name?.charAt(0) || 'U'}
                </span>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-semibold text-gray-800">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="ml-1 flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-full shadow-md shadow-red-500/20 hover:shadow-red-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span className="text-xs">⎋</span>
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && user && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg px-4 py-3 space-y-1">
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/dashboard')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/search')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Search
          </Link>
          {user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive('/admin')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Admin
            </Link>
          )}

          <div className="flex items-center gap-3 px-3 py-3 mt-2 border-t border-gray-100">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-bold uppercase">
              {user.name?.charAt(0) || 'U'}
            </span>
            <div className="flex flex-col leading-tight flex-1">
              <span className="text-sm font-semibold text-gray-800">
                {user.name}
              </span>
              <span className="text-xs text-indigo-600 font-medium uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;