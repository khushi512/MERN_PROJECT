import jwt from 'jsonwebtoken';
export const isAuthOptional = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {}

  next();
};
