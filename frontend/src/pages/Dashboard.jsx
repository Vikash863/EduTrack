import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { getStudents, getResults, getTopPerformers } from '../services/api.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role || 'teacher';
  const isAdmin = role === 'admin';
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageGpa: 0,
    passPercentage: 0,
    failPercentage: 0,
    topPerformers: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, resultsRes, topRes] = await Promise.all([
          getStudents(),
          getResults(),
          getTopPerformers({ limit: 5 }),
        ]);

        const students = studentsRes.data.students || [];
        const results = resultsRes.data.results || [];
        const topPerformers = topRes.data.topPerformers || [];

        const totalStudents = studentsRes.data.count || students.length;
        const gpaValues = students
          .map((student) => parseFloat(student.gpa || 0))
          .filter((value) => !Number.isNaN(value));
        const averageGpa = gpaValues.length
          ? gpaValues.reduce((sum, value) => sum + value, 0) / gpaValues.length
          : 0;

        const totalResults = results.length;
        const passCount = results.filter((result) => result.totalMarks >= 40).length;
        const passPercentage = totalResults ? (passCount / totalResults) * 100 : 0;
        const failPercentage = totalResults ? 100 - passPercentage : 0;

        setStats({
          totalStudents,
          averageGpa,
          passPercentage,
          failPercentage,
          topPerformers,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const chartData = useMemo(
    () =>
      stats.topPerformers.map((performer) => ({
        name: performer.student?.name?.substring(0, 10) || 'N/A',
        gpa: parseFloat(performer.avgGpa) || 0,
      })),
    [stats.topPerformers]
  );

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-blue-600 text-white p-6 shadow-lg'>
        <div className='max-w-6xl mx-auto flex flex-col gap-4 md:flex-row justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>EduTrack Dashboard</h1>
            <p className='text-blue-100'>Welcome back, {user?.name || 'Teacher'} • {isAdmin ? 'Admin' : 'Teacher'}</p>
            <p className='mt-2 text-sm text-sky-100'>
              {isAdmin
                ? 'You have full management access across students, subjects, results and analytics.'
                : 'You can review subjects and results. Administrative tasks are reserved for admins.'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className='bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold transition'
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-6xl mx-auto p-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='rounded-3xl bg-white p-6 shadow'>
            <p className='text-sm uppercase tracking-[0.2em] text-slate-500'>Total students</p>
            <p className='mt-4 text-4xl font-bold text-slate-900'>{stats.totalStudents}</p>
          </div>
          <div className='rounded-3xl bg-white p-6 shadow'>
            <p className='text-sm uppercase tracking-[0.2em] text-slate-500'>Average GPA</p>
            <p className='mt-4 text-4xl font-bold text-emerald-600'>{stats.averageGpa.toFixed(2)}</p>
          </div>
          <div className='rounded-3xl bg-white p-6 shadow'>
            <p className='text-sm uppercase tracking-[0.2em] text-slate-500'>Pass rate</p>
            <p className='mt-4 text-4xl font-bold text-blue-600'>{stats.passPercentage.toFixed(1)}%</p>
          </div>
          <div className='rounded-3xl bg-white p-6 shadow'>
            <p className='text-sm uppercase tracking-[0.2em] text-slate-500'>Fail rate</p>
            <p className='mt-4 text-4xl font-bold text-rose-500'>{stats.failPercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-2xl font-bold mb-4 text-gray-800'>Top 5 Performers</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='gpa' fill='#3b82f6' name='GPA' />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className='text-gray-500 text-center py-8'>No data available yet</p>
          )}
        </div>

        {/* Quick Links */}
        <div className='mt-8 grid grid-cols-1 md:grid-cols-4 gap-4'>
          {[
            { name: 'Students', path: '/students', color: 'bg-blue-500' },
            { name: 'Subjects', path: '/subjects', color: 'bg-green-500' },
            { name: 'Results', path: '/results', color: 'bg-purple-500' },
            { name: 'Analytics', path: '/analytics', color: 'bg-orange-500' },
          ].map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`${link.color} hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
