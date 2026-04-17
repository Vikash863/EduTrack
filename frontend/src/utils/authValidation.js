export const sanitizeText = (value) => String(value || '').trim().replace(/<[^>]*>?/gm, '');

export const validateEmail = (email) => {
  if (!email) return 'Email is required.';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) return 'Please enter a valid email address.';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return '';
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  return errors;
};

export const validateRegisterForm = ({ name, email, department, password, confirmPassword }) => {
  const errors = {};
  if (!name || String(name).trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!department) {
    errors.department = 'Please select your department.';
  }

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};
