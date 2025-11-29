// middleware/permissionMiddleware.js
const addUserData = (req, _res, next) => {
  // kalau sudah ada dari JWT, jangan ditimpa
  if (!req.user) {
    req.user = {
      id: Number(req.header('x-user-id')) || 123,
      nama: req.header('x-user-name') || 'User Karyawan',
      role: req.header('x-role') || 'karyawan',
    };
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin' });
};

module.exports = { addUserData, isAdmin };
