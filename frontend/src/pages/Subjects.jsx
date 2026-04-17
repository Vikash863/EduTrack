import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { getSubjects, addSubject, updateSubject, deleteSubject } from '../services/api.js';

export default function Subjects() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ subjectName: '', subjectCode: '', semester: '1', branch: 'CSE', credits: 3 });
  const navigate = useNavigate();

  const getTeacherId = () => user?._id || user?.id || '';

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getSubjects();
      setSubjects(response.data.subjects || []);
    } catch (error) {
      alert('Error fetching subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const subjectPayload = {
        ...formData,
        teacher: getTeacherId(),
      };

      if (editId) {
        await updateSubject(editId, subjectPayload);
        alert('Subject updated successfully');
      } else {
        await addSubject(subjectPayload);
        alert('Subject added successfully');
      }
      setFormData({ subjectName: '', subjectCode: '', semester: '1', branch: 'CSE', credits: 3 });
      setEditId(null);
      setShowForm(false);
      fetchSubjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving subject');
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      subjectName: subject.subjectName || '',
      subjectCode: subject.subjectCode || '',
      semester: subject.semester || '1',
      branch: subject.branch || 'CSE',
      credits: subject.credits || 3,
    });
    setEditId(subject._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await deleteSubject(id);
      fetchSubjects();
    } catch (error) {
      alert('Error deleting subject');
    }
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
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Subjects</h1>
            <p className='text-gray-600'>Manage subject codes, titles, and semesters.</p>
          </div>
          {isAdmin ? (
            <button
              onClick={() => {
                setShowForm((prev) => !prev);
                setEditId(null);
                setFormData({ subjectName: '', subjectCode: '', semester: '1' });
              }}
              className='rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'
            >
              {showForm ? 'Cancel' : 'Add Subject'}
            </button>
          ) : (
            <div className='rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900'>View only for teachers</div>
          )}
        </div>

        {showForm && isAdmin && (
          <form onSubmit={handleSubmit} className='mb-6 grid gap-4 md:grid-cols-4'>
            <input
              type='text'
              name='subjectName'
              value={formData.subjectName}
              onChange={handleChange}
              placeholder='Subject Name'
              required
              className='w-full rounded-lg border border-gray-300 px-4 py-2'
            />
            <input
              type='text'
              name='subjectCode'
              value={formData.subjectCode}
              onChange={handleChange}
              placeholder='Subject Code'
              required
              className='w-full rounded-lg border border-gray-300 px-4 py-2'
            />
            <select
              name='semester'
              value={formData.semester}
              onChange={handleChange}
              className='w-full rounded-lg border border-gray-300 px-4 py-2'
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
              className='w-full rounded-lg border border-gray-300 px-4 py-2'
            >
              {['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'].map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            <input
              type='number'
              name='credits'
              value={formData.credits}
              onChange={handleChange}
              placeholder='Credits'
              min='1'
              max='4'
              required
              className='w-full rounded-lg border border-gray-300 px-4 py-2'
            />
            <button type='submit' className='rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700'>
              {editId ? 'Update' : 'Save'}
            </button>
          </form>
        )}

        <div className='overflow-x-auto'>
          {loading ? (
            <p className='py-8 text-center text-gray-500'>Loading subjects…</p>
          ) : subjects.length === 0 ? (
            <p className='py-8 text-center text-gray-500'>No subjects found.</p>
          ) : (
            <table className='w-full text-left text-sm'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-3'>Code</th>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Semester</th>
                  <th className='px-4 py-3 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className='border-b hover:bg-gray-50'>
                    <td className='px-4 py-3 font-semibold text-gray-700'>{subject.subjectCode}</td>
                    <td className='px-4 py-3 text-gray-600'>{subject.subjectName}</td>
                    <td className='px-4 py-3 text-gray-600'>{subject.semester}</td>
                    <td className='px-4 py-3 text-right'>
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => handleEdit(subject)}
                            className='mr-2 rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(subject._id)}
                            className='rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600'
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

 