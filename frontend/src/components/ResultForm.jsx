import SelectField from './SelectField.jsx';

export default function ResultForm({
  studentFormInput,
  subjectFormInput,
  onStudentFormInputChange,
  onSubjectFormInputChange,
  filteredStudentFormOptions,
  filteredSubjectFormOptions,
  studentOptions,
  subjectOptions,
  formData,
  formErrors,
  selectStyles,
  handleStudentFormChange,
  handleSubjectFormChange,
  handleCreateSubject,
  handleChange,
  handleSubmit,
  isFormValid,
  loading,
  editId,
}) {
  const findOptionByValue = (options, value) => options.find((option) => option.value === value) || null;

  return (
    <form onSubmit={handleSubmit} className='mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg'>
      <div>
        <SelectField
          inputValue={studentFormInput}
          onInputChange={onStudentFormInputChange}
          options={filteredStudentFormOptions}
          value={findOptionByValue(studentOptions, formData.studentId)}
          onChange={handleStudentFormChange}
          isLoading={loading}
          placeholder='Select student...'
          noOptionsMessage={() => (loading ? 'Loading students...' : 'No students found')}
          styles={selectStyles}
          ariaLabel='Select student'
          error={formErrors.studentId}
        />
      </div>

      <div>
        <SelectField
          creatable
          inputValue={subjectFormInput}
          onInputChange={onSubjectFormInputChange}
          options={filteredSubjectFormOptions}
          value={findOptionByValue(subjectOptions, formData.subjectId)}
          onChange={handleSubjectFormChange}
          onCreateOption={handleCreateSubject}
          isLoading={loading}
          placeholder='Select or create subject...'
          noOptionsMessage={() => (loading ? 'Loading subjects...' : 'No options found')}
          styles={selectStyles}
          ariaLabel='Select or create subject'
          error={formErrors.subjectId}
        />
      </div>

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

      <input
        type='number'
        name='sessionalMarks'
        value={formData.sessionalMarks}
        onChange={handleChange}
        placeholder='Sessional (0-20)'
        min='0'
        max='20'
        required
        className='px-4 py-2 border border-gray-300 rounded-lg'
      />

      <input
        type='number'
        name='putMarks'
        value={formData.putMarks}
        onChange={handleChange}
        placeholder='PUT (0-70)'
        min='0'
        max='70'
        required
        className='px-4 py-2 border border-gray-300 rounded-lg'
      />

      <input
        type='number'
        name='finalMarks'
        value={formData.finalMarks}
        onChange={handleChange}
        placeholder='Final (0-70)'
        min='0'
        max='70'
        required
        className='px-4 py-2 border border-gray-300 rounded-lg'
      />

      <button
        type='submit'
        disabled={!isFormValid}
        className={`md:col-span-3 rounded-lg py-2 px-4 font-bold text-white transition ${
          isFormValid ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300 cursor-not-allowed'
        }`}
      >
        {editId ? 'Update' : 'Save'}
      </button>

      {Object.keys(formErrors).length > 0 && (
        <div className='md:col-span-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700'>
          <p className='font-semibold'>Fix the highlighted fields before saving:</p>
          <ul className='mt-3 list-disc space-y-1 pl-5'>
            {Object.values(formErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
