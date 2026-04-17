import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

export default function SelectField({
  creatable = false,
  inputValue,
  onInputChange,
  options,
  value,
  onChange,
  onCreateOption,
  placeholder,
  isClearable = true,
  isLoading = false,
  noOptionsMessage,
  error,
  ariaLabel,
  styles,
}) {
  const Component = creatable ? CreatableSelect : Select;

  return (
    <div>
      <Component
        inputValue={inputValue}
        onInputChange={onInputChange}
        options={options}
        value={value}
        onChange={onChange}
        onCreateOption={onCreateOption}
        filterOption={null}
        isClearable={isClearable}
        isLoading={isLoading}
        placeholder={placeholder}
        noOptionsMessage={noOptionsMessage}
        styles={styles}
        aria-label={ariaLabel}
      />
      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
    </div>
  );
}
