import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = user?.role || 'guest';
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', show: true },
    { to: '/dashboard', label: 'Dashboard', show: isAuthenticated && (isAdmin || isTeacher) },
    { to: '/students', label: 'Students', show: isAuthenticated && isAdmin },
    { to: '/subjects', label: 'Subjects', show: isAuthenticated && (isAdmin || isTeacher) },
    { to: '/results', label: 'Results', show: isAuthenticated && (isAdmin || isTeacher) },
    { to: '/attendance', label: 'Attendance', show: isAuthenticated && (isAdmin || isTeacher) },
    { to: '/analytics', label: 'Analytics', show: isAuthenticated && (isAdmin || isTeacher) },
  ];

  return (
    <nav className='sticky top-0 z-50 border-b border-blue-800/30 bg-slate-950/95 backdrop-blur-lg text-white shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2 flex-shrink-0 group'>
            <span className='text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>📚 EduTrack</span>
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center gap-1'>
            {navLinks.map((link) =>
              link.show ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className='px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-blue-500/20 transition duration-200'
                >
                  {link.label}
                </Link>
              ) : null
            )}
          </div>

          {/* Right Section */}
          <div className='hidden md:flex items-center gap-4'>
            {isAuthenticated && (
              <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-slate-950'>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className='text-sm'>
                  <p className='font-semibold text-white'>{user?.name || 'User'}</p>
                  <p className='text-xs text-slate-400'>{isAdmin ? 'Admin' : 'Teacher'}</p>
                </div>
              </div>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  to='/login'
                  className='px-4 py-2 text-sm font-semibold text-white border border-blue-400/50 rounded-lg hover:border-blue-400 hover:bg-blue-500/10 transition'
                >
                  Sign In
                </Link>
                <Link
                  to='/register'
                  className='px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition'
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className='px-4 py-2 text-sm font-semibold text-white border border-red-400/50 rounded-lg hover:border-red-400 hover:bg-red-500/10 transition'
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 rounded-lg hover:bg-blue-500/20 transition'
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden pb-4 border-t border-blue-800/30'>
            <div className='space-y-2 py-4'>
              {navLinks.map((link) =>
                link.show ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className='block px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-blue-500/20 transition'
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>

            {/* Mobile User Info */}
            {isAuthenticated && (
              <div className='px-4 py-3 border-t border-blue-800/30 mt-4'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-slate-950'>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className='text-sm'>
                    <p className='font-semibold text-white'>{user?.name || 'User'}</p>
                    <p className='text-xs text-slate-400'>{isAdmin ? 'Admin' : 'Teacher'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Auth Buttons */}
            <div className='flex gap-2 px-4 pt-4 border-t border-blue-800/30'>
              {!isAuthenticated ? (
                <>
                  <Link
                    to='/login'
                    onClick={() => setMobileMenuOpen(false)}
                    className='flex-1 px-4 py-2 text-sm font-semibold text-white border border-blue-400/50 rounded-lg text-center'
                  >
                    Sign In
                  </Link>
                  <Link
                    to='/register'
                    onClick={() => setMobileMenuOpen(false)}
                    className='flex-1 px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg text-center'
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className='w-full px-4 py-2 text-sm font-semibold text-white border border-red-400/50 rounded-lg hover:bg-red-500/10'
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
