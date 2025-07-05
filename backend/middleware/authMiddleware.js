const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.token !== token) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
