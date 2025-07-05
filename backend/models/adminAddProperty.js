const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  propertyImage: {
    filename: String,
    path: String,
    url: String,
    mimetype: String,
    size: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
