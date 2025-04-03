// routes/courseRoutes.js
const express = require('express');
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, getTeacherCourses } = require('../controllers/courseController');
const router = express.Router();

router.get('/', getCourses);
router.post('/', createCourse);
router.get('/:id', getCourseById);
router.get('/teacher/:id', getTeacherCourses);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;