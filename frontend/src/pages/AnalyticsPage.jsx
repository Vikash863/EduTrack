import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [passFailData, setPassFailData] = useState(null);
  const [branchStats, setBranchStats] = useState({});
  const [topPerformers, setTopPerformers] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const params = selectedSemester ? { semester: selectedSemester } : {};

        const [dashboardRes, passFailRes, branchRes, topRes] = await Promise.all([
          axios.get(`${API_URL}/analytics/dashboard`, { params }),
          axios.get(`${API_URL}/analytics/pass-fail`, { params }),
          axios.get(`${API_URL}/analytics/branch-stats`, { params }),
          axios.get(`${API_URL}/analytics/top-performers`, { params: { ...params, limit: 10 } }),
        ]);

        setDashboardData(dashboardRes.data.dashboard);
        setPassFailData(passFailRes.data.stats);
        setBranchStats(branchRes.data.branchStats || {});
        setTopPerformers(topRes.data.topPerformers || []);

        // Set semesters from 1 to 8
        if (!selectedSemester && semesters.length === 0) {
          setSemesters(Array.from({ length: 8 }, (_, i) => i + 1));
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedSemester]);

  const gradeData = dashboardData?.gradeDistribution
    ? Object.entries(dashboardData.gradeDistribution).map(([grade, count]) => ({
        name: grade,
        value: count,
      }))
    : [];

  const branchChartData = Object.entries(branchStats).map(([branch, stats]) => ({
    branch,
    ...stats,
  }));

  const topPerformersChartData = topPerformers.map((performer) => ({
    name: performer.student?.name?.substring(0, 15) || 'N/A',
    gpa: parseFloat(performer.avgGpa) || 0,
    avgMarks: parseFloat(performer.avgMarks) || 0,
  }));

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl text-gray-600'>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-blue-600 text-white p-6 shadow-lg'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
            <p className='text-blue-100'>Real-time performance analytics and insights</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className='bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded'
          >
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto p-6'>
        {/* Semester Filter */}
        <div className='mb-6 flex gap-4 items-center'>
          <label className='text-gray-700 font-semibold'>Filter by Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className='border border-gray-300 rounded px-4 py-2 bg-white'
          >
            <option value=''>All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* KPI Cards */}
        {dashboardData && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white rounded-lg shadow p-6 border-t-4 border-blue-600'>
              <p className='text-gray-600 text-sm font-semibold'>Total Students</p>
              <p className='text-4xl font-bold text-blue-600 mt-2'>{dashboardData.totalStudents}</p>
            </div>
            <div className='bg-white rounded-lg shadow p-6 border-t-4 border-green-600'>
              <p className='text-gray-600 text-sm font-semibold'>Pass Count</p>
              <p className='text-4xl font-bold text-green-600 mt-2'>{dashboardData.passCount}</p>
            </div>
            <div className='bg-white rounded-lg shadow p-6 border-t-4 border-red-600'>
              <p className='text-gray-600 text-sm font-semibold'>Fail Count</p>
              <p className='text-4xl font-bold text-red-600 mt-2'>{dashboardData.failCount}</p>
            </div>
            <div className='bg-white rounded-lg shadow p-6 border-t-4 border-yellow-600'>
              <p className='text-gray-600 text-sm font-semibold'>Average Marks</p>
              <p className='text-4xl font-bold text-yellow-600 mt-2'>
                {parseFloat(dashboardData.avgMarks).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Pass/Fail Stats */}
        {passFailData && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-xl font-bold mb-4'>Pass/Fail Statistics</h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center border-b pb-2'>
                  <span className='text-gray-600'>Pass Percentage</span>
                  <span className='text-2xl font-bold text-green-600'>
                    {parseFloat(passFailData.passPercentage).toFixed(1)}%
                  </span>
                </div>
                <div className='flex justify-between items-center border-b pb-2'>
                  <span className='text-gray-600'>Fail Percentage</span>
                  <span className='text-2xl font-bold text-red-600'>
                    {parseFloat(passFailData.failPercentage).toFixed(1)}%
                  </span>
                </div>
                <div className='flex justify-between items-center border-b pb-2'>
                  <span className='text-gray-600'>Total Results</span>
                  <span className='text-2xl font-bold text-gray-800'>{passFailData.totalStudents}</span>
                </div>
              </div>
            </div>

            {/* Pass/Fail Pie Chart */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-xl font-bold mb-4'>Pass/Fail Distribution</h3>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pass', value: passFailData.passCount },
                      { name: 'Fail', value: passFailData.failCount },
                    ]}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    <Cell fill='#10b981' />
                    <Cell fill='#ef4444' />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Grade Distribution */}
        {gradeData.length > 0 && (
          <div className='bg-white rounded-lg shadow p-6 mb-8'>
            <h3 className='text-xl font-bold mb-4'>Grade Distribution</h3>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#3b82f6' name='Student Count' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Branch-wise Statistics */}
        {branchChartData.length > 0 && (
          <div className='bg-white rounded-lg shadow p-6 mb-8'>
            <h3 className='text-xl font-bold mb-4'>Branch-wise Performance</h3>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={branchChartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='branch' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='passPercentage' fill='#10b981' name='Pass %' />
                <Bar dataKey='avgMarks' fill='#3b82f6' name='Avg Marks' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Performers */}
        {topPerformersChartData.length > 0 && (
          <div className='bg-white rounded-lg shadow p-6 mb-8'>
            <h3 className='text-xl font-bold mb-4'>Top 10 Performers</h3>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={topPerformersChartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='gpa' fill='#f59e0b' name='GPA' />
                <Bar dataKey='avgMarks' fill='#3b82f6' name='Avg Marks' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Branch Stats Table */}
        {branchChartData.length > 0 && (
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-xl font-bold mb-4'>Detailed Branch Statistics</h3>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-4 py-2 text-left'>Branch</th>
                    <th className='px-4 py-2 text-center'>Total Students</th>
                    <th className='px-4 py-2 text-center'>Pass Count</th>
                    <th className='px-4 py-2 text-center'>Pass %</th>
                    <th className='px-4 py-2 text-center'>Avg Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {branchChartData.map((branch, index) => (
                    <tr key={index} className='border-b hover:bg-gray-50'>
                      <td className='px-4 py-2 font-semibold'>{branch.branch}</td>
                      <td className='px-4 py-2 text-center'>{branch.totalStudents}</td>
                      <td className='px-4 py-2 text-center text-green-600 font-semibold'>
                        {branch.passCount}
                      </td>
                      <td className='px-4 py-2 text-center'>
                        <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold'>
                          {parseFloat(branch.passPercentage).toFixed(1)}%
                        </span>
                      </td>
                      <td className='px-4 py-2 text-center font-semibold'>
                        {parseFloat(branch.avgMarks).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
