import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectField from '../components/SelectField.jsx';
import ResultForm from '../components/ResultForm.jsx';
import { getResults, addResult, deleteResult, updateResult, getStudents, getSubjects, addSubject } from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Results() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ student: '', subject: '', semester: '' });
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    semester: '1',
    sessionalMarks: '',
    putMarks: '',
    finalMarks: '',
  });
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const [studentFilterInput, setStudentFilterInput] = useState('');
  const [subjectFilterInput, setSubjectFilterInput] = useState('');
  const [studentFormInput, setStudentFormInput] = useState('');
  const [subjectFormInput, setSubjectFormInput] = useState('');
  const [debouncedStudentFilterInput, setDebouncedStudentFilterInput] = useState('');
  const [debouncedSubjectFilterInput, setDebouncedSubjectFilterInput] = useState('');
  const [debouncedStudentFormInput, setDebouncedStudentFormInput] = useState('');
  const [debouncedSubjectFormInput, setDebouncedSubjectFormInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedStudentFilterInput(studentFilterInput), 300);
    return () => clearTimeout(timer);
  }, [studentFilterInput]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSubjectFilterInput(subjectFilterInput), 300);
    return () => clearTimeout(timer);
  }, [subjectFilterInput]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedStudentFormInput(studentFormInput), 300);
    return () => clearTimeout(timer);
  }, [studentFormInput]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSubjectFormInput(subjectFormInput), 300);
    return () => clearTimeout(timer);
  }, [subjectFormInput]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resultsRes, studentsRes, subjectsRes] = await Promise.all([
        getResults(filters),
        getStudents(),
        getSubjects(),
      ]);
      setResults(resultsRes.data.results || []);
      setStudents(studentsRes.data.students || []);
      setSubjects(subjectsRes.data.subjects || []);
    } catch (error) {
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStudentFilterChange = (selected) => {
    setFilters((prev) => ({ ...prev, student: selected?.value || '' }));
  };

  const handleSubjectFilterChange = (selected) => {
    setFilters((prev) => ({ ...prev, subject: selected?.value || '' }));
  };

  const handleStudentFormChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      studentId: selected?.value || '',
      semester:
        selected?.data?.semester && (!prev.semester || prev.semester === '1')
          ? String(selected.data.semester)
          : prev.semester,
    }));
    setStudentFormInput('');
  };

  const handleSubjectFormChange = (selected) => {
    setFormData((prev) => ({ ...prev, subjectId: selected?.value || '' }));
    setSubjectFormInput('');
  };

  const handleStudentFormInputChange = (value, actionMeta) => {
    if (actionMeta.action === 'input-change') setStudentFormInput(value);
    if (actionMeta.action === 'set-value' || actionMeta.action === 'clear') setStudentFormInput('');
    return value;
  };

  const handleSubjectFormInputChange = (value, actionMeta) => {
    if (actionMeta.action === 'input-change') setSubjectFormInput(value);
    if (actionMeta.action === 'set-value' || actionMeta.action === 'clear') setSubjectFormInput('');
    return value;
  };

  const filterOptions = (options, search) => {
    if (!search) return options;
    return options.filter((option) => option.label.toLowerCase().includes(search.trim().toLowerCase()));
  };

  const studentOptions = students.map((student) => ({
    value: student._id,
    label: `${student.name} (${student.rollNumber})`,
  }));

  const subjectOptions = subjects.map((subject) => ({
    value: subject._id,
    label: `${subject.subjectCode} - ${subject.subjectName}`,
  }));

  const filteredStudentFilterOptions = useMemo(
    () => filterOptions(studentOptions, debouncedStudentFilterInput),
    [studentOptions, debouncedStudentFilterInput]
  );

  const filteredSubjectFilterOptions = useMemo(
    () => filterOptions(subjectOptions, debouncedSubjectFilterInput),
    [subjectOptions, debouncedSubjectFilterInput]
  );

  const filteredStudentFormOptions = useMemo(
    () => filterOptions(studentOptions, debouncedStudentFormInput),
    [studentOptions, debouncedStudentFormInput]
  );

  const filteredSubjectFormOptions = useMemo(
    () => filterOptions(subjectOptions, debouncedSubjectFormInput),
    [subjectOptions, debouncedSubjectFormInput]
  );

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '44px',
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
      boxShadow: 'none',
      '&:hover': { borderColor: '#2563eb' },
    }),
    menu: (base) => ({ ...base, zIndex: 999 }),
  };

  const findOptionByValue = (options, value) => options.find((option) => option.value === value) || null;

  const getTeacherId = () => {
    const savedTeacher = JSON.parse(localStorage.getItem('teacher') || 'null');
    return user?._id || user?.id || savedTeacher?._id || savedTeacher?.id || '';
  };

  const generateSubjectCode = (name) => {
    const initials = (name.match(/\b\w/g) || []).join('').toUpperCase();
    return initials.slice(0, 6) || name.slice(0, 6).toUpperCase();
  };

  const branches = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'];

  const handleCreateSubject = async (inputValue) => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const teacherId = getTeacherId();
    if (!teacherId) {
      alert('Unable to create a new subject because teacher identity is missing.');
      return;
    }

    const defaultCode = generateSubjectCode(trimmed);
    const subjectCodePrompt = window.prompt('Enter the new subject code', defaultCode);
    if (!subjectCodePrompt) {
      return;
    }

    const subjectCode = subjectCodePrompt.trim().toUpperCase();
    if (!subjectCode) {
      alert('Subject code is required to create a new subject.');
      return;
    }

    const defaultBranch = formData.branch || 'CSE';
    const branchPrompt = window.prompt(
      `Enter the subject branch (${branches.join(', ')})`,
      defaultBranch
    );
    if (!branchPrompt) {
      return;
    }

    const branch = branchPrompt.trim().toUpperCase();
    if (!branches.includes(branch)) {
      alert(`Branch must be one of: ${branches.join(', ')}`);
      return;
    }

    try {
      const subjectPayload = {
        subjectCode,
        subjectName: trimmed,
        semester: formData.semester || '1',
        branch,
        credits: 3,
        teacher: teacherId,
      };
      const response = await addSubject(subjectPayload);
      const newSubject = response.data.subject;
      setSubjects((prev) => [newSubject, ...prev]);
      setFormData((prev) => ({ ...prev, subjectId: newSubject._id }));
      setSubjectFormInput('');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to create subject');
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.studentId) errors.studentId = 'Student selection is required.';
    if (!formData.subjectId) errors.subjectId = 'Subject selection is required.';

    const sessional = Number(formData.sessionalMarks);
    if (formData.sessionalMarks === '') {
      errors.sessionalMarks = 'Sessional marks are required.';
    } else if (Number.isNaN(sessional) || sessional < 0 || sessional > 20) {
      errors.sessionalMarks = 'Sessional marks must be between 0 and 20.';
    }

    const put = Number(formData.putMarks);
    if (formData.putMarks === '') {
      errors.putMarks = 'PUT marks are required.';
    } else if (Number.isNaN(put) || put < 0 || put > 70) {
      errors.putMarks = 'PUT marks must be between 0 and 70.';
    }

    const finalMark = Number(formData.finalMarks);
    if (formData.finalMarks === '') {
      errors.finalMarks = 'Final marks are required.';
    } else if (Number.isNaN(finalMark) || finalMark < 0 || finalMark > 70) {
      errors.finalMarks = 'Final marks must be between 0 and 70.';
    }

    return errors;
  };

  const formErrors = useMemo(() => validateForm(), [formData]);
  const isFormValid = Object.keys(formErrors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }

    try {
      const payload = {
        student: formData.studentId,
        subject: formData.subjectId,
        semester: formData.semester,
        sessionalMarks: formData.sessionalMarks,
        putMarks: formData.putMarks,
        finalMarks: formData.finalMarks,
      };

      if (editId) {
        await updateResult(editId, payload);
        alert('Result updated successfully');
      } else {
        await addResult(payload);
        alert('Result added successfully');
      }
      setFormData({
        studentId: '',
        subjectId: '',
        semester: '1',
        sessionalMarks: '',
        putMarks: '',
        finalMarks: '',
      });
      setEditId(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving result');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteResult(id);
        fetchData();
      } catch (error) {
        alert('Error deleting result');
      }
    }
  };

  const handleEdit = (result) => {
    setFormData({
      studentId: result.student._id,
      subjectId: result.subject._id,
      semester: result.semester,
      sessionalMarks: result.sessionalMarks,
      putMarks: result.putMarks,
      finalMarks: result.finalMarks,
    });
    setEditId(result._id);
    setShowForm(true);
  };

  const exportResultsToPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text('EduTrack Results Export', 14, 16);

    const headers = ['Student', 'Roll Number', 'Subject', 'Semester', 'Sessional', 'PUT', 'Final', 'Total', 'Grade'];
    const rows = results.map((result) => [
      result.student?.name || '',
      result.student?.rollNumber || '',
      result.subject?.subjectCode || '',
      result.semester || '',
      result.sessionalMarks ?? '',
      result.putMarks ?? '',
      result.finalMarks ?? '',
      result.totalMarks ?? '',
      result.grade || '',
    ]);

    autoTable(doc, {
      startY: 24,
      head: [headers],
      body: rows,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: { 0: { cellWidth: 40 }, 2: { cellWidth: 40 } },
    });

    doc.save(`EduTrack_Results_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportResultsToExcel = () => {
    const exportData = results.map((result) => ({
      Student: result.student?.name || '',
      'Roll Number': result.student?.rollNumber || '',
      Subject: result.subject?.subjectCode || '',
      Semester: result.semester || '',
      Sessional: result.sessionalMarks ?? '',
      PUT: result.putMarks ?? '',
      Final: result.finalMarks ?? '',
      Total: result.totalMarks ?? '',
      Grade: result.grade || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, `EduTrack_Results_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>Results Management</h1>

        {/* Filters */}
        <div className='mb-6 grid grid-cols-1 lg:grid-cols-5 gap-4'>
          <div>
            <SelectField
              inputValue={studentFilterInput}
              onInputChange={(value, actionMeta) => {
                if (actionMeta.action === 'input-change') setStudentFilterInput(value);
                if (actionMeta.action === 'set-value' || actionMeta.action === 'clear') setStudentFilterInput('');
                return value;
              }}
              options={filteredStudentFilterOptions}
              value={findOptionByValue(studentOptions, filters.student)}
              onChange={handleStudentFilterChange}
              isLoading={loading}
              placeholder='Filter student...'
              noOptionsMessage={() => (loading ? 'Loading students...' : 'No options found')}
              styles={selectStyles}
              ariaLabel='Filter student'
            />
          </div>

          <div>
            <SelectField
              inputValue={subjectFilterInput}
              onInputChange={(value, actionMeta) => {
                if (actionMeta.action === 'input-change') setSubjectFilterInput(value);
                if (actionMeta.action === 'set-value' || actionMeta.action === 'clear') setSubjectFilterInput('');
                return value;
              }}
              options={filteredSubjectFilterOptions}
              value={findOptionByValue(subjectOptions, filters.subject)}
              onChange={handleSubjectFilterChange}
              isLoading={loading}
              placeholder='Filter subject...'
              noOptionsMessage={() => (loading ? 'Loading subjects...' : 'No options found')}
              styles={selectStyles}
              ariaLabel='Filter subject'
            />
          </div>

          {isAdmin ? (
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditId(null);
                setFormData({
                  studentId: '',
                  subjectId: '',
                  semester: '1',
                  sessionalMarks: '',
                  putMarks: '',
                  finalMarks: '',
                });
              }}
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
            >
              {showForm ? 'Cancel' : 'Add Result'}
            </button>
          ) : (
            <div className='rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900'>View-only results for teachers</div>
          )}

          <button
            onClick={exportResultsToPdf}
            disabled={results.length === 0}
            className='bg-slate-900 disabled:bg-slate-300 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg'
          >
            Download PDF
          </button>

          <button
            onClick={exportResultsToExcel}
            disabled={results.length === 0}
            className='bg-emerald-600 disabled:bg-emerald-200 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg'
          >
            Download Excel
          </button>
        </div>

        {/* Form */}
        {showForm && isAdmin && (
          <ResultForm
            studentFormInput={studentFormInput}
            subjectFormInput={subjectFormInput}
            onStudentFormInputChange={handleStudentFormInputChange}
            onSubjectFormInputChange={handleSubjectFormInputChange}
            filteredStudentFormOptions={filteredStudentFormOptions}
            filteredSubjectFormOptions={filteredSubjectFormOptions}
            studentOptions={studentOptions}
            subjectOptions={subjectOptions}
            formData={formData}
            formErrors={formErrors}
            selectStyles={selectStyles}
            handleStudentFormChange={handleStudentFormChange}
            handleSubjectFormChange={handleSubjectFormChange}
            handleCreateSubject={handleCreateSubject}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isFormValid={isFormValid}
            loading={loading}
            editId={editId}
          />
        )}

        {/* Table */}
        <div className='overflow-x-auto'>
          {loading ? (
            <p className='text-center py-4'>Loading...</p>
          ) : results.length === 0 ? (
            <p className='text-center py-4 text-gray-500'>No results found</p>
          ) : (
            <table className='w-full text-sm'>
              <thead className='bg-gray-200'>
                <tr>
                  <th className='px-4 py-2 text-left'>Student</th>
                  <th className='px-4 py-2 text-left'>Subject</th>
                  <th className='px-4 py-2 text-center'>Sessional</th>
                  <th className='px-4 py-2 text-center'>PUT</th>
                  <th className='px-4 py-2 text-center'>Final</th>
                  <th className='px-4 py-2 text-center'>Total</th>
                  <th className='px-4 py-2 text-center'>Grade</th>
                  <th className='px-4 py-2 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id} className='border-b hover:bg-gray-50'>
                    <td className='px-4 py-2'>{result.student?.name}</td>
                    <td className='px-4 py-2'>{result.subject?.subjectCode}</td>
                    <td className='px-4 py-2 text-center'>{result.sessionalMarks}</td>
                    <td className='px-4 py-2 text-center'>{result.putMarks}</td>
                    <td className='px-4 py-2 text-center'>{result.finalMarks}</td>
                    <td className='px-4 py-2 text-center font-bold'>{result.totalMarks}</td>
                    <td className='px-4 py-2 text-center font-bold text-green-600'>{result.grade}</td>
                    <td className='px-4 py-2 text-center space-x-2'>
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => handleEdit(result)}
                            className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(result._id)}
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

