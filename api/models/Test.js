const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: { type: String, required: true },
  questions: { type: String, required: true }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
