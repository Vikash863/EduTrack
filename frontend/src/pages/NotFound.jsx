import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-slate-950 text-white flex items-center justify-center px-6'>
      <div className='max-w-xl rounded-3xl border border-slate-800 bg-slate-900/90 p-12 text-center shadow-2xl'>
        <h1 className='text-6xl font-bold'>404</h1>
        <p className='mt-6 text-xl text-slate-300'>Page not found.</p>
        <p className='mt-4 text-slate-400'>The route you followed does not exist or has been moved.</p>
        <Link
          to='/'
          className='mt-8 inline-flex rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400'
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
