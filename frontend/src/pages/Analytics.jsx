import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { getTopPerformers, getSubjectAverages } from '../services/api.js';

export default function Analytics() {
  const { user } = useContext(AuthContext);
  const role = user?.role || 'teacher';
  const [topPerformers, setTopPerformers] = useState([]);
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [topRes, averageRes] = await Promise.all([
          getTopPerformers({ limit: 6 }),
          getSubjectAverages({ limit: 6 }),
        ]);

        setTopPerformers(topRes.data.topPerformers || []);
        setSubjectAverages(averageRes.data.subjectAverages || []);
      } catch (error) {
        console.error('Analytics fetch error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <button
        onClick={() => navigate('/dashboard')}
        className='mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600'
      >
        ← Back
      </button>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='rounded-3xl bg-white p-6 shadow'>
          <h1 className='text-2xl font-bold text-gray-800'>Analytics Overview</h1>
          <p className='mt-3 text-gray-600'>Review your top performers and subject averages in one place.</p>
          <p className='mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700'>
            {role === 'admin'
              ? 'Your analytics view includes broad insights for decision-making and oversight.'
              : 'Teachers can use these analytics to understand class performance without changing system data.'}
          </p>
        </div>
        <div className='rounded-3xl bg-white p-6 shadow'>
          <p className='text-sm uppercase tracking-[0.2em] text-sky-500'>Top Performers</p>
          <p className='mt-2 text-4xl font-bold text-slate-900'>{topPerformers.length}</p>
          <p className='mt-3 text-gray-600'>Students with highest GPAs.</p>
        </div>
        <div className='rounded-3xl bg-white p-6 shadow'>
          <p className='text-sm uppercase tracking-[0.2em] text-sky-500'>Subjects tracked</p>
          <p className='mt-2 text-4xl font-bold text-slate-900'>{subjectAverages.length}</p>
          <p className='mt-3 text-gray-600'>Averages calculated from available subjects.</p>
        </div>
      </div>

      <div className='mt-8 grid gap-6 lg:grid-cols-2'>
        <section className='rounded-3xl bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-800'>Top Performers</h2>
            <span className='text-sm text-slate-500'>{topPerformers.length} records</span>
          </div>
          {loading ? (
            <p className='mt-6 text-gray-500'>Loading...</p>
          ) : topPerformers.length === 0 ? (
            <p className='mt-6 text-gray-500'>No performer data available.</p>
          ) : (
            <div className='mt-6 space-y-4'>
              {topPerformers.map((student, index) => (
                <div key={index} className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                  <p className='font-semibold text-gray-900'>{student.student?.name || student.name || 'Unknown'}</p>
                  <p className='text-sm text-gray-600'>GPA: {parseFloat(student.avgGpa || student.gpa || 0).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className='rounded-3xl bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-800'>Subject Averages</h2>
            <span className='text-sm text-slate-500'>{subjectAverages.length} subjects</span>
          </div>
          {loading ? (
            <p className='mt-6 text-gray-500'>Loading...</p>
          ) : subjectAverages.length === 0 ? (
            <p className='mt-6 text-gray-500'>No subject averages available.</p>
          ) : (
            <div className='mt-6 space-y-4'>
              {subjectAverages.map((item, index) => (
                <div key={index} className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                  <p className='font-semibold text-gray-900'>{item.subjectCode || item.subjectName || 'Unknown subject'}</p>
                  <p className='text-sm text-gray-600'>Average: {parseFloat(item.average || item.avg || 0).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
