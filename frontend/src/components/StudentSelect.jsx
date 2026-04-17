import { useMemo } from 'react';
import Select from 'react-select';

const StudentSelect = ({ options, value, onChange, inputValue, onInputChange, isLoading, error, placeholder = 'Select student...' }) => {
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  );

  return (
    <div className='space-y-1'>
      <Select
        inputValue={inputValue}
        onInputChange={(newValue, actionMeta) => {
          if (actionMeta.action === 'input-change') {
            onInputChange(newValue);
          }
          if (actionMeta.action === 'set-value' || actionMeta.action === 'clear') {
            onInputChange('');
          }
          return newValue;
        }}
        options={options}
        value={selectedOption}
        onChange={onChange}
        filterOption={null}
        isClearable
        isLoading={isLoading}
        placeholder={placeholder}
        noOptionsMessage={() => (isLoading ? 'Loading students...' : 'No options found')}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: '44px',
            borderRadius: '0.75rem',
            borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
            boxShadow: 'none',
            '&:hover': { borderColor: '#2563eb' },
          }),
          menu: (base) => ({ ...base, zIndex: 999 }),
        }}
      />
      {error && <p className='text-sm text-rose-600'>{error}</p>}
    </div>
  );
};

export default StudentSelect;
