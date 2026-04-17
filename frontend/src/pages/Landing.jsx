import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <header className='mx-auto max-w-6xl px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-6'>
        <div className='max-w-2xl'>
          <p className='text-sm uppercase tracking-[0.25em] text-sky-400'>EduTrack</p>
          <h1 className='mt-6 text-5xl font-extrabold leading-tight'>A smarter school management dashboard for teachers.</h1>
          <p className='mt-6 text-lg text-slate-300'>Track students, results, attendance, and analytics with a modern and secure system built for academic teams.</p>
          <div className='mt-8 flex flex-col sm:flex-row gap-4'>
            <Link to='/login' className='inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg transition hover:bg-sky-400'>
              Login
            </Link>
            <Link to='/register' className='inline-flex items-center justify-center rounded-full border border-slate-500 px-8 py-3 text-base font-semibold text-white transition hover:border-slate-300 hover:text-slate-100'>
              Register
            </Link>
          </div>
        </div>

        <div className='w-full max-w-xl rounded-3xl bg-slate-900/90 p-8 shadow-2xl ring-1 ring-slate-700'>
          <h2 className='text-2xl font-bold text-white'>Why EduTrack?</h2>
          <ul className='mt-6 space-y-4 text-slate-300'>
            <li className='rounded-2xl border border-slate-800 bg-slate-950/80 p-4'>
              <strong className='text-white'>Simplified student tracking</strong> with fast search, filters, and class summaries.
            </li>
            <li className='rounded-2xl border border-slate-800 bg-slate-950/80 p-4'>
              <strong className='text-white'>Automated result management</strong> for sessional, final, and GPA calculations.
            </li>
            <li className='rounded-2xl border border-slate-800 bg-slate-950/80 p-4'>
              <strong className='text-white'>Learning analytics</strong> for top performers, subject averages, and semester comparisons.
            </li>
          </ul>
        </div>
      </header>

      <section className='bg-slate-900/80 py-16'>
        <div className='mx-auto max-w-6xl px-6'>
          <div className='grid gap-8 lg:grid-cols-3'>
            {[
              { title: 'Centralized classroom data', description: 'All student, result, and subject records in one secure dashboard.' },
              { title: 'Teacher-friendly workflow', description: 'Quick forms, intelligent navigation, and fast page load for real use.' },
              { title: 'Modern analytics', description: 'Use actionable reports to spot top performers and data patterns.' },
            ].map((item) => (
              <article key={item.title} className='rounded-3xl border border-slate-800 bg-slate-950/95 p-8 shadow-xl'>
                <h3 className='text-2xl font-semibold text-white'>{item.title}</h3>
                <p className='mt-4 text-slate-400'>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-6 py-16'>
        <div className='grid gap-12 lg:grid-cols-2 items-center'>
          <div>
            <h2 className='text-4xl font-bold text-white'>Built for schools and faculty who need clarity.</h2>
            <p className='mt-6 text-lg leading-8 text-slate-300'>EduTrack delivers a polished interface, secure login flow, and simplified result management so teachers can spend more time teaching and less time managing spreadsheets.</p>
            <Link to='/register' className='mt-8 inline-flex rounded-full bg-sky-500 px-8 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400'>Get started</Link>
          </div>
          <div className='rounded-3xl bg-slate-950/90 p-8 shadow-2xl ring-1 ring-slate-700'>
            <h2 className="text-3xl font-bold text-center mb-6">
                        Why Choose EduTrack?
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                        <div>✔ Secure JWT Authentication</div>
                        <div>✔ Clean Login & Registration Flow</div>
                        <div>✔ Protected Dashboard Access</div>
                        <div>✔ Student & Result Management</div>
                        <div>✔ Performance Analytics & Insights</div>
                        <div>✔ Fully Responsive UI</div>
                        </div>
          </div>
        </div>
      </section>
    </div>
  );
}
