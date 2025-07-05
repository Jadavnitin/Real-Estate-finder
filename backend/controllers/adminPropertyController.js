const AdminAddProperty = require('../models/adminAddProperty');


exports.adminAddProperty = async (req, res) => {
  try {
    // Upload validation
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Property image is required' });
    }

    const {
      propertyName,
      description,
      address,
      latitude,
      longitude,
    } = req.body;

    // Check for required fields
    if (!propertyName || !description || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const existing = await AdminAddProperty.findOne({
      $or: [
        { propertyName: propertyName.trim() },
        { 'coordinates.latitude': lat, 'coordinates.longitude': lon },
      ],
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: 'Property with same name or location already exists' });
    }

    // Construct image URL
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const newProperty = new AdminAddProperty({
      propertyName,
      description,
      address,
      coordinates: {
        latitude: lat,
        longitude: lon,
      },
      propertyImage: {
        filename: req.file.filename,
        path: req.file.path,
        url: url,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });

    await newProperty.save();

    res.status(201).json({
      message: 'Property added successfully',
      property: newProperty,
    });
  } catch (error) {
    console.error('Add property error:', error.message);
    res.status(500).json({ message: 'Server error while adding property' });
  }
};



exports.getAllProperties = async (req, res) => {
  try {
    const properties = await AdminAddProperty.find().sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Get properties error:', error.message);
    res.status(500).json({ message: 'Server error while fetching properties' });
  }
};
