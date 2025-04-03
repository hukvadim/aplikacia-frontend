
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', userController.getUsers);
router.post('/', userController.addUser);
// router.get("/del", userController.delUsersTable);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/auth', userController.authUser);
router.get('/answers/:id', userController.userAnswers);
router.get('/setAdmin/:id', userController.setAdmin);
router.get('/teacher/students/:teacher_id', userController.getStudentsForTeacher);
router.get("/teacher/analytics/:id", userController.getTeacherAnalytics);
router.get("/admin/teachers", userController.getAdminTeachers);
router.post("/admin/teachers", userController.updateTeacherStatus);


module.exports = router;