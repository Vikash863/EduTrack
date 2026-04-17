import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = user?.role || 'guest';
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='bg-blue-600 text-white px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-md'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center'>
        <div>
          <h1 className='text-xl font-bold'>EduTrack</h1>
          {isAuthenticated && (
            <p className='text-sm text-sky-100'>
              Signed in as {user?.name || user?.email || 'User'} ({isAdmin ? 'Admin' : 'Teacher'})
            </p>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-4'>
          <Link to='/' className='hover:underline'>Home</Link>
          {isAuthenticated && <Link to='/dashboard' className='hover:underline'>Dashboard</Link>}
          {isAuthenticated && (isAdmin || isTeacher) && <Link to='/students' className='hover:underline'>Students</Link>}
          {isAuthenticated && (isAdmin || isTeacher) && <Link to='/subjects' className='hover:underline'>Subjects</Link>}
          {isAuthenticated && (isAdmin || isTeacher) && <Link to='/results' className='hover:underline'>Results</Link>}
          {isAuthenticated && (isAdmin || isTeacher) && <Link to='/analytics' className='hover:underline'>Analytics</Link>}
        </div>
      </div>

      <div className='space-x-4 flex items-center'>
        {!isAuthenticated ? (
          <>
            <Link to='/login' className='hover:underline'>Login</Link>
            <Link to='/register' className='hover:underline'>Register</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className='rounded-lg border border-white px-4 py-2 hover:bg-white hover:text-slate-900 transition'
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
