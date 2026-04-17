import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { getStudents, addStudent, deleteStudent, updateStudent } from '../services/api.js';

export default function Students() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const canManageStudents = ['admin', 'teacher'].includes(user?.role);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ semester: '', branch: '' });
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    email: '',
    semester: '1',
    branch: 'CSE',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents(filters);
      setStudents(response.data.students || []);
    } catch (error) {
      alert('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateStudent(editId, formData);
        alert('Student updated successfully');
      } else {
        await addStudent(formData);
        alert('Student added successfully');
      }
      setFormData({
        rollNumber: '',
        name: '',
        email: '',
        semester: '1',
        branch: 'CSE',
        phone: '',
        address: '',
      });
      setEditId(null);
      setShowForm(false);
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteStudent(id);
        fetchStudents();
      } catch (error) {
        alert('Error deleting student');
      }
    }
  };

  const handleEdit = (student) => {
    setFormData(student);
    setEditId(student._id);
    setShowForm(true);
  };

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <button
        onClick={() => navigate('/dashboard')}
        className='mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600'
      >
        ← Back
      </button>

      <div className='bg-white rounded-lg shadow p-6'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>Students Management</h1>

        {/* Filters */}
        {!isAdmin && (
          <div className='mb-6 rounded-3xl border border-amber-300 bg-amber-50 p-4 text-amber-900'>
            <p className='font-semibold'>Teacher view</p>
            <p className='text-sm'>Teachers can review and manage student information here.</p>
          </div>
        )}

        <div className='mb-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Semester</label>
            <select
              name='semester'
              value={filters.semester}
              onChange={handleFilterChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg'
            >
              <option value=''>All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Branch</label>
            <select
              name='branch'
              value={filters.branch}
              onChange={handleFilterChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg'
            >
              <option value=''>All Branches</option>
              {['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'].map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className='flex items-end'>
            {canManageStudents ? (
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditId(null);
                  setFormData({
                    rollNumber: '',
                    name: '',
                    email: '',
                    semester: '1',
                    branch: 'CSE',
                    phone: '',
                    address: '',
                  });
                }}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
              >
                {showForm ? 'Cancel' : 'Add Student'}
              </button>
            ) : (
              <div className='rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>Admin only</div>
            )}
          </div>
        </div>

        {/* Form */}
        {showForm && canManageStudents && (
          <form onSubmit={handleSubmit} className='mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg'>
            <input
              name='rollNumber'
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder='Roll Number'
              required
              className='px-4 py-2 border border-gray-300 rounded-lg'
            />
            <input
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Name'
              required
              className='px-4 py-2 border border-gray-300 rounded-lg'
            />
            <input
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Email'
              required
              className='px-4 py-2 border border-gray-300 rounded-lg'
            />
            <select
              name='semester'
              value={formData.semester}
              onChange={handleChange}
              className='px-4 py-2 border border-gray-300 rounded-lg'
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            <select
              name='branch'
              value={formData.branch}
              onChange={handleChange}
              className='px-4 py-2 border border-gray-300 rounded-lg'
            >
              {['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'].map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            <input
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='Phone'
              required
              className='px-4 py-2 border border-gray-300 rounded-lg'
            />
            <input
              name='address'
              value={formData.address}
              onChange={handleChange}
              placeholder='Address'
              className='px-4 py-2 border border-gray-300 rounded-lg md:col-span-2'
            />
            <button type='submit' className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg'>
              {editId ? 'Update' : 'Save'}
            </button>
          </form>
        )}

        {/* Table */}
        <div className='overflow-x-auto'>
          {loading ? (
            <p className='text-center py-4'>Loading...</p>
          ) : students.length === 0 ? (
            <p className='text-center py-4 text-gray-500'>No students found</p>
          ) : (
            <table className='w-full text-sm'>
              <thead className='bg-gray-200'>
                <tr>
                  <th className='px-4 py-2 text-left'>Roll Number</th>
                  <th className='px-4 py-2 text-left'>Name</th>
                  <th className='px-4 py-2 text-left'>Email</th>
                  <th className='px-4 py-2 text-left'>Semester</th>
                  <th className='px-4 py-2 text-left'>Branch</th>
                  <th className='px-4 py-2 text-left'>GPA</th>
                  <th className='px-4 py-2 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className='border-b hover:bg-gray-50'>
                    <td className='px-4 py-2'>{student.rollNumber}</td>
                    <td className='px-4 py-2'>{student.name}</td>
                    <td className='px-4 py-2'>{student.email}</td>
                    <td className='px-4 py-2'>{student.semester}</td>
                    <td className='px-4 py-2'>{student.branch}</td>
                    <td className='px-4 py-2 font-bold'>{student.gpa.toFixed(2)}</td>
                    <td className='px-4 py-2 text-center space-x-2'>
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => handleEdit(student)}
                            className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm'
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>Read only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

 