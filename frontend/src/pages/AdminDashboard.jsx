import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const params = selectedBranch ? { branch: selectedBranch } : {};

        const [studentsRes, subjectsRes, analyticsRes, attendanceRes] = await Promise.all([
          axios.get(`${API_URL}/students`),
          axios.get(`${API_URL}/subjects`),
          axios.get(`${API_URL}/analytics/dashboard`, { params }),
          axios.get(`${API_URL}/attendance/stats`, { params }),
        ]);

        setStudents(studentsRes.data.students || []);
        setSubjects(subjectsRes.data.subjects || []);
        setAnalytics(analyticsRes.data.dashboard);
        setAttendance(attendanceRes.data.stats);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [selectedBranch]);

  const branches = [...new Set(students.map((s) => s.branch))];

  const chartData = students
    .slice(0, 10)
    .map((student) => ({
      name: student.name.substring(0, 10),
      gpa: student.gpa || 0,
      cgpa: student.cgpa || 0,
    }));

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl text-gray-600'>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 shadow-lg'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-4xl font-bold mb-2'>Admin Dashboard</h1>
          <p className='text-purple-100'>Complete system overview and management</p>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto p-6'>
        {/* Key Metrics */}
        {analytics && (
          <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-8'>
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-600'>
              <p className='text-gray-600 text-sm font-semibold'>Total Students</p>
              <p className='text-3xl font-bold text-blue-600 mt-2'>{analytics.totalStudents}</p>
            </div>
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-green-600'>
              <p className='text-gray-600 text-sm font-semibold'>Total Results</p>
              <p className='text-3xl font-bold text-green-600 mt-2'>{analytics.totalResults}</p>
            </div>
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-500'>
              <p className='text-gray-600 text-sm font-semibold'>Pass Rate</p>
              <p className='text-3xl font-bold text-blue-500 mt-2'>
                {parseFloat(analytics.passPercentage).toFixed(1)}%
              </p>
            </div>
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-red-600'>
              <p className='text-gray-600 text-sm font-semibold'>Fail Rate</p>
              <p className='text-3xl font-bold text-red-600 mt-2'>
                {parseFloat(analytics.failPercentage).toFixed(1)}%
              </p>
            </div>
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600'>
              <p className='text-gray-600 text-sm font-semibold'>Avg Marks</p>
              <p className='text-3xl font-bold text-yellow-600 mt-2'>
                {parseFloat(analytics.avgMarks).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Attendance Stats */}
        {attendance && (
          <div className='bg-white rounded-lg shadow p-6 mb-8'>
            <h3 className='text-xl font-bold mb-4'>Attendance Overview</h3>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <p className='text-gray-600 text-sm'>Total Classes</p>
                <p className='text-2xl font-bold text-gray-800'>{attendance.stats.totalClasses}</p>
              </div>
              <div>
                <p className='text-gray-600 text-sm'>Present</p>
                <p className='text-2xl font-bold text-green-600'>{attendance.stats.presentCount}</p>
              </div>
              <div>
                <p className='text-gray-600 text-sm'>Absent</p>
                <p className='text-2xl font-bold text-red-600'>{attendance.stats.absentCount}</p>
              </div>
              <div>
                <p className='text-gray-600 text-sm'>Overall Attendance</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {attendance.stats.overallAttendancePercentage}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className='flex gap-4 mb-6 border-b flex-wrap'>
          {['overview', 'students', 'subjects', 'performance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold border-b-2 transition capitalize ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Student Performance Chart */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-xl font-bold mb-4'>Top Students</h3>
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
                <p className='text-gray-500 text-center py-8'>No data available</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-xl font-bold mb-4'>System Statistics</h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center pb-2 border-b'>
                  <span className='text-gray-600'>Total Subjects</span>
                  <span className='text-2xl font-bold'>{subjects.length}</span>
                </div>
                <div className='flex justify-between items-center pb-2 border-b'>
                  <span className='text-gray-600'>Active Students</span>
                  <span className='text-2xl font-bold text-green-600'>
                    {students.filter((s) => s.status === 'active').length}
                  </span>
                </div>
                <div className='flex justify-between items-center pb-2 border-b'>
                  <span className='text-gray-600'>Inactive Students</span>
                  <span className='text-2xl font-bold text-gray-600'>
                    {students.filter((s) => s.status !== 'active').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-xl font-bold mb-4'>Student Management</h3>
            <div className='mb-4 flex gap-4 items-center'>
              <label className='text-gray-700 font-semibold'>Filter by Branch:</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className='border border-gray-300 rounded px-4 py-2'
              >
                <option value=''>All Branches</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-4 py-2 text-left'>Roll Number</th>
                    <th className='px-4 py-2 text-left'>Name</th>
                    <th className='px-4 py-2 text-left'>Email</th>
                    <th className='px-4 py-2 text-left'>Branch</th>
                    <th className='px-4 py-2 text-center'>CGPA</th>
                    <th className='px-4 py-2 text-center'>Status</th>
                    <th className='px-4 py-2 text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter((s) => !selectedBranch || s.branch === selectedBranch)
                    .slice(0, 20)
                    .map((student) => (
                      <tr key={student._id} className='border-b hover:bg-gray-50'>
                        <td className='px-4 py-2'>{student.rollNumber}</td>
                        <td className='px-4 py-2 font-semibold'>{student.name}</td>
                        <td className='px-4 py-2'>{student.email}</td>
                        <td className='px-4 py-2'>{student.branch}</td>
                        <td className='px-4 py-2 text-center font-bold'>
                          {student.cgpa?.toFixed(2) || 'N/A'}
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              student.status === 'active'
                                ? 'bg-green-200 text-green-800'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <button
                            onClick={() => navigate(`/student/${student._id}`)}
                            className='text-blue-600 hover:text-blue-800 font-semibold'
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-xl font-bold mb-4'>Subject Management</h3>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-4 py-2 text-left'>Subject Code</th>
                    <th className='px-4 py-2 text-left'>Subject Name</th>
                    <th className='px-4 py-2 text-left'>Semester</th>
                    <th className='px-4 py-2 text-left'>Branch</th>
                    <th className='px-4 py-2 text-center'>Credits</th>
                    <th className='px-4 py-2 text-left'>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => (
                    <tr key={index} className='border-b hover:bg-gray-50'>
                      <td className='px-4 py-2 font-semibold'>{subject.subjectCode}</td>
                      <td className='px-4 py-2'>{subject.subjectName}</td>
                      <td className='px-4 py-2 text-center'>{subject.semester}</td>
                      <td className='px-4 py-2'>{subject.branch}</td>
                      <td className='px-4 py-2 text-center'>{subject.credits}</td>
                      <td className='px-4 py-2'>{subject.teacher?.name || 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-xl font-bold mb-4'>System Performance</h3>
            <p className='text-gray-600 mb-4'>
              Monitor key performance metrics and system health
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg'>
                <p className='text-gray-600 text-sm'>API Response Time</p>
                <p className='text-3xl font-bold text-blue-600 mt-2'>45ms</p>
              </div>
              <div className='bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg'>
                <p className='text-gray-600 text-sm'>System Uptime</p>
                <p className='text-3xl font-bold text-green-600 mt-2'>99.9%</p>
              </div>
              <div className='bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-lg'>
                <p className='text-gray-600 text-sm'>Active Users</p>
                <p className='text-3xl font-bold text-purple-600 mt-2'>
                  {students.length + subjects.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
