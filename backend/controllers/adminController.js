const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin with plain password (hashing handled by model hook)
    const newAdmin = new Admin({ username, password });

    // Generate JWT token
    const token = jwt.sign(
      { adminId: newAdmin._id, username: newAdmin.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Store token and save (password will be hashed by pre-save hook)
    newAdmin.token = token;
    await newAdmin.save();

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: { id: newAdmin._id, username: newAdmin.username },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update token
    admin.token = token;
    await admin.save();

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.logoutAdmin = async (req, res) => {
  try {
    const { username } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

  
    admin.token = null;
    await admin.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
