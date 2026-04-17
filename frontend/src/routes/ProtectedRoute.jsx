import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className='min-h-screen grid place-items-center bg-slate-50 text-slate-900'>
        <div className='rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-lg'>
          <p className='text-lg font-semibold'>Checking your session...</p>
          <p className='mt-2 text-sm text-slate-500'>Preparing your secure access.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
}
