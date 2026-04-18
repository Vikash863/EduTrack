import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStudents, getSubjects, bulkAddAttendance, getSubjectAttendance } from '../services/api.js';

export default function AttendanceManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('mark'); // 'mark' or 'view'
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, subjectsRes] = await Promise.all([
          getStudents(),
          getSubjects(),
        ]);

        setStudents(studentsRes.data.students || []);
        setSubjects(subjectsRes.data.subjects || []);

        // Initialize attendance object
        const attendanceObj = {};
        (studentsRes.data.students || []).forEach((student) => {
          attendanceObj[student._id] = { status: 'present', remarks: '' };
        });
        setAttendance(attendanceObj);
      } catch (error) {
        console.error('Error fetching data:', error);
        const errorMsg = error.response?.data?.message || 'Failed to load data';
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks },
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    try {
      setSubmitting(true);
      const records = students.map((student) => ({
        student: student._id,
        subject: selectedSubject,
        date: selectedDate,
        status: attendance[student._id]?.status || 'present',
        remarks: attendance[student._id]?.remarks || '',
      }));

      const response = await bulkAddAttendance({ records });
      toast.success(response.data?.message || 'Attendance marked successfully');
      setAttendance({});
      setSelectedSubject('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error submitting attendance:', error);
      const errorMsg = error.response?.data?.message || 'Failed to mark attendance';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewSubjectAttendance = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    try {
      setFetching(true);
      const response = await getSubjectAttendance(selectedSubject);
      setSubjectAttendance(response.data.studentAttendance || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      const errorMsg = error.response?.data?.message || 'Failed to load attendance data';
      toast.error(errorMsg);
    } finally {
      setFetching(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl text-gray-600'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-blue-600 text-white p-6 shadow-lg'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>Attendance Management</h1>
            <p className='text-blue-100'>Mark and track student attendance</p>
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
        {/* View Toggle */}
        <div className='flex gap-4 mb-6'>
          <button
            onClick={() => setView('mark')}
            className={`px-6 py-3 font-semibold rounded-lg transition ${
              view === 'mark'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setView('view')}
            className={`px-6 py-3 font-semibold rounded-lg transition ${
              view === 'view'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            View Attendance
          </button>
        </div>

        {view === 'mark' ? (
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-2xl font-bold mb-6'>Mark Attendance</h2>

            {/* Subject & Date Selection */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div>
                <label className='block text-gray-700 font-semibold mb-2'>Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className='w-full border border-gray-300 rounded px-4 py-2'
                >
                  <option value=''>Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subjectName} ({subject.subjectCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-gray-700 font-semibold mb-2'>Date</label>
                <input
                  type='date'
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className='w-full border border-gray-300 rounded px-4 py-2'
                />
              </div>
            </div>

            {/* Attendance Table */}
            {selectedSubject && (
              <div className='overflow-x-auto'>
                <table className='w-full border'>
                  <thead className='bg-gray-200'>
                    <tr>
                      <th className='px-4 py-2 text-left border'>Roll Number</th>
                      <th className='px-4 py-2 text-left border'>Student Name</th>
                      <th className='px-4 py-2 text-center border'>Status</th>
                      <th className='px-4 py-2 text-left border'>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id} className='border-b hover:bg-gray-50'>
                        <td className='px-4 py-2 border'>{student.rollNumber}</td>
                        <td className='px-4 py-2 border'>{student.name}</td>
                        <td className='px-4 py-2 text-center border'>
                          <select
                            value={attendance[student._id]?.status || 'present'}
                            onChange={(e) => handleStatusChange(student._id, e.target.value)}
                            className='border border-gray-300 rounded px-2 py-1'
                          >
                            <option value='present'>Present</option>
                            <option value='absent'>Absent</option>
                            <option value='leave'>Leave</option>
                          </select>
                        </td>
                        <td className='px-4 py-2 border'>
                          <input
                            type='text'
                            placeholder='Add remarks...'
                            value={attendance[student._id]?.remarks || ''}
                            onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                            className='w-full border border-gray-300 rounded px-2 py-1'
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Submit Button */}
            <div className='mt-6 flex justify-center'>
              <button
                onClick={handleSubmitAttendance}
                className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition'
              >
                Mark Attendance
              </button>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-2xl font-bold mb-6'>View Attendance</h2>

            {/* Subject Selection */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <div>
                <label className='block text-gray-700 font-semibold mb-2'>Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className='w-full border border-gray-300 rounded px-4 py-2'
                >
                  <option value=''>Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subjectName} ({subject.subjectCode})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleViewSubjectAttendance}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold h-fit'
              >
                View
              </button>
            </div>

            {/* Attendance Summary Table */}
            {subjectAttendance.length > 0 && (
              <div className='overflow-x-auto'>
                <table className='w-full border'>
                  <thead className='bg-gray-200'>
                    <tr>
                      <th className='px-4 py-2 text-left border'>Roll Number</th>
                      <th className='px-4 py-2 text-left border'>Student Name</th>
                      <th className='px-4 py-2 text-center border'>Total Classes</th>
                      <th className='px-4 py-2 text-center border'>Present</th>
                      <th className='px-4 py-2 text-center border'>Absent</th>
                      <th className='px-4 py-2 text-center border'>Leave</th>
                      <th className='px-4 py-2 text-center border'>Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectAttendance.map((record, index) => (
                      <tr key={index} className='border-b hover:bg-gray-50'>
                        <td className='px-4 py-2 border'>{record.student.rollNumber}</td>
                        <td className='px-4 py-2 border'>{record.student.name}</td>
                        <td className='px-4 py-2 text-center border font-semibold'>
                          {record.totalClasses}
                        </td>
                        <td className='px-4 py-2 text-center border text-green-600 font-semibold'>
                          {record.present}
                        </td>
                        <td className='px-4 py-2 text-center border text-red-600 font-semibold'>
                          {record.absent}
                        </td>
                        <td className='px-4 py-2 text-center border text-yellow-600 font-semibold'>
                          {record.leave}
                        </td>
                        <td className='px-4 py-2 text-center border font-bold'>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              parseFloat(record.attendancePercentage) >= 75
                                ? 'bg-green-200 text-green-800'
                                : 'bg-red-200 text-red-800'
                            }`}
                          >
                            {record.attendancePercentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {subjectAttendance.length === 0 && selectedSubject && (
              <p className='text-gray-500 text-center py-8'>No attendance records found for this subject</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
