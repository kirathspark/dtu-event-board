const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: false,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  formLink: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Event', eventSchema);