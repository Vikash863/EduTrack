import { useContext, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerTeacher } from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import InputField from '../components/InputField.jsx';
import { sanitizeText, validateRegisterForm } from '../utils/authValidation.js';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: '',
    remember: true,
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  const formErrors = useMemo(() => validateRegisterForm(formData), [formData]);
  const isFormValid = Object.keys(formErrors).length === 0;

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (name === 'remember') {
      setFormData((prev) => ({ ...prev, remember: checked }));
      return;
    }
    const sanitizedValue = name === 'password' || name === 'confirmPassword' ? value : sanitizeText(value);
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!isFormValid) {
      setServerError('Please review all fields before creating your account.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        password: formData.password,
      };
      const response = await registerTeacher(payload);
      login(response.data.token, response.data.teacher, formData.remember);
      toast.success('Account created successfully! Redirecting to dashboard.');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(message);
      toast.error(message);
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return (
    <div className='min-h-screen bg-slate-950 px-4 py-10 text-slate-900'>
      <div className='mx-auto max-w-xl'>
        <div className='overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-900/5'>
          <div className='bg-gradient-to-r from-indigo-600 to-sky-600 px-8 py-10 text-white sm:px-12'>
            <div className='flex items-center gap-4'>
              <div className='grid h-14 w-14 place-items-center rounded-3xl bg-white/15 text-2xl font-bold text-white'>E</div>
              <div>
                <p className='text-xs uppercase tracking-[0.35em] text-sky-100'>EduTrack</p>
                <h1 className='mt-3 text-3xl font-semibold'>Create your teacher profile</h1>
              </div>
            </div>
            <p className='mt-6 max-w-md text-sm text-slate-100/85'>Register and get instant access to results, subject management, and analytics.</p>
          </div>

          <div className='px-8 py-8 sm:px-12'>
            <div className='mb-6'>
              <h2 className='text-2xl font-semibold text-slate-900'>Get started</h2>
              <p className='mt-2 text-sm text-slate-500'>Fill in your details to create a secure account.</p>
            </div>

            {serverError && (
              <div className='mb-5 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <InputField
                label='Full Name'
                name='name'
                type='text'
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter your full name'
                autoComplete='name'
                error={formErrors.name}
              />

              <InputField
                label='Email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='teacher@example.com'
                autoComplete='email'
                error={formErrors.email}
              />

              <div>
                <label className='block text-sm font-semibold text-slate-700'>Department</label>
                <select
                  name='department'
                  value={formData.department}
                  onChange={handleChange}
                  className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    formErrors.department ? 'border-rose-400 bg-rose-50 focus:border-rose-500' : 'border-slate-300 bg-white focus:border-sky-500'
                  }`}
                >
                  <option value=''>Select Department</option>
                  <option value='CSE'>Computer Science</option>
                  <option value='IT'>Information Technology</option>
                  <option value='ECE'>Electronics</option>
                  <option value='ME'>Mechanical</option>
                  <option value='CE'>Civil</option>
                  <option value='EE'>Electrical</option>
                </select>
                {formErrors.department && <p className='mt-2 text-sm text-rose-600'>{formErrors.department}</p>}
              </div>

              <InputField
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter password (min 6 chars)'
                autoComplete='new-password'
                error={formErrors.password}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((prev) => !prev)}
              />

              <InputField
                label='Confirm Password'
                name='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Repeat your password'
                autoComplete='new-password'
                error={formErrors.confirmPassword}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword((prev) => !prev)}
              />

              <label className='flex items-center gap-3 text-sm text-slate-600'>
                <input
                  type='checkbox'
                  name='remember'
                  checked={formData.remember}
                  onChange={handleChange}
                  className='h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500'
                />
                Keep me signed in
              </label>

              <button
                type='submit'
                disabled={!isFormValid || loading}
                className={`w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                  isFormValid && !loading ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className='mt-6 text-center text-sm text-slate-500'>
              Already have an account?{' '}
              <Link to='/login' className='font-semibold text-sky-600 hover:text-sky-700'>
                Login instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
