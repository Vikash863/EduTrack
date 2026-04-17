import { useContext, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginTeacher } from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import InputField from '../components/InputField.jsx';
import { sanitizeText, validateLoginForm } from '../utils/authValidation.js';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useContext(AuthContext);

  const from = location.state?.from?.pathname || '/dashboard';
  const formErrors = useMemo(() => validateLoginForm(form), [form]);
  const isFormValid = Object.keys(formErrors).length === 0;

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (name === 'remember') {
      setForm((prev) => ({ ...prev, remember: checked }));
      return;
    }

    const sanitizedValue = name === 'password' ? value : sanitizeText(value);
    setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!isFormValid) {
      setServerError('Please fix the highlighted fields before signing in.');
      return;
    }

    setLoading(true);

    try {
      const response = await loginTeacher({ email: form.email, password: form.password });
      login(response.data.token, response.data.teacher, form.remember);
      toast.success('Welcome back! Redirecting to dashboard.');
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to login. Please check your details.';
      setServerError(message);
      toast.error(message);
      setForm((prev) => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast('Forgot password is coming soon. Contact your admin for help.', { icon: '🔒' });
  };

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return (
    <div className='min-h-screen bg-slate-950 px-4 py-10 text-slate-900'>
      <div className='mx-auto max-w-xl'>
        <div className='overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-900/5'>
          <div className='bg-gradient-to-r from-sky-600 to-indigo-600 px-8 py-10 text-white sm:px-12'>
            <div className='flex items-center gap-4'>
              <div className='grid h-14 w-14 place-items-center rounded-3xl bg-white/15 text-2xl font-bold text-white'>E</div>
              <div>
                <p className='text-xs uppercase tracking-[0.35em] text-sky-100'>EduTrack</p>
                <h1 className='mt-3 text-3xl font-semibold'>Teacher sign in</h1>
              </div>
            </div>
            <p className='mt-6 max-w-md text-sm text-slate-100/85'>Secure access for teachers to manage students, subjects, and results with smart authentication.</p>
          </div>

          <div className='px-8 py-8 sm:px-12'>
            <div className='mb-6'>
              <h2 className='text-2xl font-semibold text-slate-900'>Welcome back</h2>
              <p className='mt-2 text-sm text-slate-500'>Sign in and continue to your dashboard.</p>
            </div>

            {serverError && (
              <div className='mb-5 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <InputField
                label='Email'
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                placeholder='teacher@example.com'
                autoComplete='email'
                error={formErrors.email}
              />

              <InputField
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder='••••••••'
                autoComplete='current-password'
                error={formErrors.password}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((prev) => !prev)}
              />

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <label className='flex items-center gap-3 text-sm text-slate-600'>
                  <input
                    type='checkbox'
                    name='remember'
                    checked={form.remember}
                    onChange={handleChange}
                    className='h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500'
                  />
                  Remember me
                </label>
                <button type='button' onClick={handleForgotPassword} className='text-sm font-semibold text-sky-600 transition hover:text-sky-700'>
                  Forgot password?
                </button>
              </div>

              <button
                type='submit'
                disabled={!isFormValid || loading}
                className={`w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                  isFormValid && !loading ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className='mt-6 text-center text-sm text-slate-500'>
              New to EduTrack?{' '}
              <Link to='/register' className='font-semibold text-sky-600 hover:text-sky-700'>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;