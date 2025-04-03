const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  user_course_id: { type: mongoose.Schema.Types.ObjectId },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: { type: String, required: true }
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
