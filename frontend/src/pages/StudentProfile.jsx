import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function StudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [studentRes, resultsRes, attendanceRes, analyticsRes, trendsRes] = await Promise.all([
          axios.get(`${API_URL}/students/${studentId}`),
          axios.get(`${API_URL}/results?student=${studentId}`),
          axios.get(`${API_URL}/attendance/student/${studentId}`),
          axios.get(`${API_URL}/analytics/student/${studentId}`),
          axios.get(`${API_URL}/analytics/semester-trends/${studentId}`),
        ]);

        setStudent(studentRes.data.student);
        setResults(resultsRes.data.results || []);
        setAttendance(attendanceRes.data);
        setAnalytics(analyticsRes.data);
        setTrends(trendsRes.data.trends || []);
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/student/${studentId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student_report_${student?.rollNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl text-gray-600'>Loading student profile...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl text-red-600'>Student not found</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-blue-600 text-white p-6 shadow-lg'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>{student.name}</h1>
            <p className='text-blue-100'>Roll Number: {student.rollNumber}</p>
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
        {/* Student Information Card */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-6'>
          <h2 className='text-2xl font-bold mb-6'>Personal Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <p className='text-gray-500 text-sm'>Email</p>
              <p className='text-lg font-semibold'>{student.email}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Phone</p>
              <p className='text-lg font-semibold'>{student.phone}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Branch</p>
              <p className='text-lg font-semibold'>{student.branch}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Semester</p>
              <p className='text-lg font-semibold'>{student.semester}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Section</p>
              <p className='text-lg font-semibold'>{student.section || 'N/A'}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Registration Date</p>
              <p className='text-lg font-semibold'>
                {new Date(student.registrationDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>CGPA</p>
              <p className='text-2xl font-bold text-blue-600'>{student.cgpa?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Current GPA</p>
              <p className='text-2xl font-bold text-green-600'>{student.gpa?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex gap-4 mb-6 border-b'>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'results'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'attendance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'trends'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Trends
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Stats Cards */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-xl font-bold mb-4'>Academic Stats</h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center border-b pb-2'>
                  <span className='text-gray-600'>Total Subjects</span>
                  <span className='text-2xl font-bold text-blue-600'>{results.length}</span>
                </div>
                <div className='flex justify-between items-center border-b pb-2'>
                  <span className='text-gray-600'>Average Marks</span>
                  <span className='text-2xl font-bold text-green-600'>
                    {results.length > 0
                      ? (results.reduce((sum, r) => sum + r.totalMarks, 0) / results.length).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className='flex justify-between items-center border-b pb-2'>
                  <span className='text-gray-600'>Pass Rate</span>
                  <span className='text-2xl font-bold text-emerald-600'>
                    {results.length > 0
                      ? ((results.filter((r) => r.totalMarks >= 40).length / results.length) * 100).toFixed(1) + '%'
                      : '0%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance Card */}
            {attendance && (
              <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-xl font-bold mb-4'>Attendance</h3>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center border-b pb-2'>
                    <span className='text-gray-600'>Present</span>
                    <span className='text-2xl font-bold text-blue-600'>{attendance.presentCount}</span>
                  </div>
                  <div className='flex justify-between items-center border-b pb-2'>
                    <span className='text-gray-600'>Absent</span>
                    <span className='text-2xl font-bold text-red-600'>
                      {attendance.totalClasses - attendance.presentCount}
                    </span>
                  </div>
                  <div className='flex justify-between items-center border-b pb-2'>
                    <span className='text-gray-600'>Total Classes</span>
                    <span className='text-2xl font-bold text-gray-600'>{attendance.totalClasses}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Attendance %</span>
                    <span className='text-2xl font-bold text-green-600'>{attendance.attendancePercentage}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Grade Distribution */}
            {analytics?.gradeDistribution && (
              <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-xl font-bold mb-4'>Grade Distribution</h3>
                <ResponsiveContainer width='100%' height={250}>
                  <PieChart>
                    <Pie
                      data={Object.entries(analytics.gradeDistribution).map(([grade, count]) => ({
                        name: grade,
                        value: count,
                      }))}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {Object.keys(analytics.gradeDistribution).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-xl font-bold mb-4'>Semester-wise Results</h3>
            {results.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-200'>
                    <tr>
                      <th className='px-4 py-2 text-left'>Semester</th>
                      <th className='px-4 py-2 text-left'>Subject</th>
                      <th className='px-4 py-2 text-left'>Code</th>
                      <th className='px-4 py-2 text-center'>Marks</th>
                      <th className='px-4 py-2 text-center'>Grade</th>
                      <th className='px-4 py-2 text-center'>Grade Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className='border-b hover:bg-gray-50'>
                        <td className='px-4 py-2'>{result.semester}</td>
                        <td className='px-4 py-2'>{result.subject?.subjectName}</td>
                        <td className='px-4 py-2'>{result.subject?.subjectCode}</td>
                        <td className='px-4 py-2 text-center'>{result.totalMarks}</td>
                        <td className='px-4 py-2 text-center font-bold'>{result.grade}</td>
                        <td className='px-4 py-2 text-center'>{result.gradePoint?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-gray-500 text-center py-8'>No results recorded yet</p>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && attendance?.records && (
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-xl font-bold mb-4'>Attendance Records</h3>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-4 py-2 text-left'>Date</th>
                    <th className='px-4 py-2 text-left'>Subject</th>
                    <th className='px-4 py-2 text-center'>Status</th>
                    <th className='px-4 py-2 text-left'>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.records.slice(0, 20).map((record, index) => (
                    <tr key={index} className='border-b hover:bg-gray-50'>
                      <td className='px-4 py-2'>{new Date(record.date).toLocaleDateString()}</td>
                      <td className='px-4 py-2'>{record.subject?.subjectName}</td>
                      <td className='px-4 py-2 text-center'>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            record.status === 'present'
                              ? 'bg-green-200 text-green-800'
                              : record.status === 'absent'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}
                        >
                          {record.status.toUpperCase()}
                        </span>
                      </td>
                      <td className='px-4 py-2'>{record.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && trends.length > 0 && (
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-xl font-bold mb-4'>Performance Trends</h3>
            <ResponsiveContainer width='100%' height={400}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='semester' label={{ value: 'Semester', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Marks / GPA', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='avgMarks' stroke='#3b82f6' name='Average Marks' />
                <Line type='monotone' dataKey='gpa' stroke='#10b981' name='GPA' />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Download Report Button */}
        <div className='mt-6 flex justify-center'>
          <button
            onClick={handleDownloadReport}
            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition'
          >
            Download Full Report (PDF)
          </button>
        </div>
      </main>
    </div>
  );
}
