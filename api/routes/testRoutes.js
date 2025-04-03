// routes/testRoutes.js
const express = require('express');
const { 
    createTest, 
    getTests, 
    getTestById, 
    updateTest, 
    deleteTest,
    getTestsByCourseId,
    saveTestResults,
    getTestResultsByUser,
    clearAnswersTable
} = require('../controllers/testController');
const router = express.Router();

// Routes for tests
// router.get('/answers/clear', clearAnswersTable);
router.post('/', createTest);
router.get('/', getTests);
router.get('/:id', getTestById);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);
router.get('/course/:id', getTestsByCourseId);
router.post('/save', saveTestResults);
router.get('/test-results/:userId', getTestResultsByUser);


module.exports = router;
