import jwt from 'jsonwebtoken';

const generateToken = (id, role = 'teacher') => {
  const secret = process.env.JWT_SECRET || 'change_this_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  if (!process.env.JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET is not defined. Using a development fallback. Set JWT_SECRET in .env for production.');
  }

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};

export default generateToken;
