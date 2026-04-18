import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { getStudents, addStudent, deleteStudent, updateStudent } from '../services/api.js';

export default function Students() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
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
    setFormData({
      rollNumber: student.rollNumber,
      name: student.name,
      email: student.email,
      semester: student.semester,
      branch: student.branch,
      phone: student.phone,
      address: student.address,
    });
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

        {!isAdmin && (
          <div className='mb-6 rounded-3xl border border-amber-300 bg-amber-50 p-4 text-amber-900'>
            <p className='font-semibold'>Teacher view</p>
            <p className='text-sm'>Teachers can review student information here.</p>
          </div>
        )}

        <div className='mb-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <select name='semester' value={filters.semester} onChange={handleFilterChange} className='px-4 py-2 border rounded-lg'>
            <option value=''>All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>

          <select name='branch' value={filters.branch} onChange={handleFilterChange} className='px-4 py-2 border rounded-lg'>
            <option value=''>All Branches</option>
            {['CSE','IT','ECE','ME','CE','EE'].map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className='bg-blue-600 text-white rounded-lg'
            >
              {showForm ? 'Cancel' : 'Add Student'}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className='grid gap-3'>
            <input name='name' value={formData.name} onChange={handleChange} placeholder='Name' required />
            <input name='email' value={formData.email} onChange={handleChange} placeholder='Email' required />
            <button type='submit'>Save</button>
          </form>
        )}

        <table className='w-full'>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>

                {/* ✅ FIXED LINE */}
                <td>
                  {Number(student.gpa || 0).toFixed(2)}
                </td>

                <td>
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}