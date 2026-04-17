import { useId } from 'react';

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  autoComplete,
  showPassword,
  onTogglePassword,
  disabled = false,
}) {
  const id = useId();

  return (
    <label htmlFor={id} className='block'>
      <span className='text-sm font-semibold text-slate-700'>{label}</span>
      <div className='relative mt-2'>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full rounded-2xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            error ? 'border-rose-400 bg-rose-50 focus:border-rose-500' : 'border-slate-300 bg-white focus:border-sky-500'
          }`}
        />

        {type === 'password' && typeof showPassword === 'boolean' && (
          <button
            type='button'
            onClick={onTogglePassword}
            className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200'
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {helperText && !error && <p className='mt-2 text-sm text-slate-500'>{helperText}</p>}
      {error && <p className='mt-2 text-sm text-rose-600'>{error}</p>}
    </label>
  );
}
