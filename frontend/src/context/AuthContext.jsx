import { createContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

const getStoredProfile = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem('teacher') || localStorage.getItem('teacher');
    return JSON.parse(stored || 'null');
  } catch {
    return null;
  }
};

const decodeToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(() => {
    const storedProfile = getStoredProfile();
    const payload = decodeToken(getStoredToken());
    if (!payload && !storedProfile) return null;
    return {
      ...storedProfile,
      ...payload,
      role: payload?.role || storedProfile?.role || 'teacher',
    };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    const payload = decodeToken(storedToken);
    const profile = getStoredProfile();

    if (!payload) {
      localStorage.removeItem('token');
      localStorage.removeItem('teacher');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('teacher');
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    const resolvedUser = {
      ...profile,
      ...payload,
      role: payload.role || profile?.role || 'teacher',
    };

    setToken(storedToken);
    setUser(resolvedUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;
    const payload = decodeToken(token);
    const profile = getStoredProfile();
    setUser({
      ...profile,
      ...payload,
      role: payload?.role || profile?.role || 'teacher',
    });
  }, [token]);

  const login = (newToken, profile, remember = true) => {
    if (!newToken) return;

    if (remember) {
      localStorage.setItem('token', newToken);
      if (profile) {
        localStorage.setItem('teacher', JSON.stringify(profile));
      }
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('teacher');
    } else {
      sessionStorage.setItem('token', newToken);
      if (profile) {
        sessionStorage.setItem('teacher', JSON.stringify(profile));
      }
      localStorage.removeItem('token');
      localStorage.removeItem('teacher');
    }

    const payload = decodeToken(newToken);
    const resolvedUser = {
      ...profile,
      ...payload,
      role: payload?.role || profile?.role || 'teacher',
    };

    setToken(newToken);
    setUser(resolvedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('teacher');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('teacher');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  const value = useMemo(
    () => ({ token, user, role: user?.role || null, login, logout, isAuthenticated, loading }),
    [token, user, loading]
  );

  if (loading) {
    return (
      <div className='min-h-screen grid place-items-center bg-slate-50 text-slate-900'>
        <div className='rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-lg'>
          <p className='text-lg font-semibold'>Checking your session...</p>
          <p className='mt-2 text-sm text-slate-500'>Please wait while we validate your credentials.</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
