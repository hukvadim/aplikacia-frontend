const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const Answer = require('../models/Answer'); // Модель відповіді
const Test = require('../models/Test'); // Модель тесту
const Course = require('../models/Course'); // Модель курсу

// Створення користувача
exports.addUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            publish: role === 'teacher' ? 'no' : 'yes',
        });

        await user.save();
        res.status(201).json({ message: 'User added successfully', userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add user' });
    }
};

// Отримати всіх користувачів
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Отримати користувача за ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// Оновлення користувача
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, publish } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (user.role === 'teacher' && publish) user.publish = publish;

        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Видалення користувача
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// Функція для реєстрації користувача
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['user', 'teacher'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Role must be "user" or "teacher".' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            publish: role === 'teacher' ? 'no' : 'yes',
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// Функція для авторизації користувача
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Incorrect email or password' });

        const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });

        user.token = token;
        await user.save();

        res.status(200).json({
            message: 'User logged in successfully',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, publish: user.publish },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error during login' });
    }
};

// Функція для перевірки токену
exports.authUser = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'secret');
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, publish: user.publish } });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
};



// Функція для отримання відповідей користувача з назвами курсів
exports.userAnswers = async (req, res) => {
    try {
        const userId = req.params.id;

        // Отримуємо відповіді користувача з відповідними курсами та тестами
        const answers = await Answer.aggregate([
            { $match: { user_id: userId } },
            { $lookup: {
                from: 'tests', 
                localField: 'test_id', 
                foreignField: '_id', 
                as: 'test'
            }},
            { $unwind: '$test' },
            { $lookup: {
                from: 'courses',
                localField: 'test.course_id',
                foreignField: '_id',
                as: 'course'
            }},
            { $unwind: '$course' },
            { $project: {
                answer_id: '$_id',
                answers: 1,
                test_title: '$test.title',
                course_title: '$course.title'
            }}
        ]);

        res.json({ answers });
    } catch (err) {
        console.error('Error fetching user answers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get students assigned to a teacher based on user_course_id
exports.getStudentsForTeacher = async (req, res) => {
    try {
        const { teacher_id } = req.params;

        if (!teacher_id) {
            return res.status(400).json({ error: 'Teacher ID is required' });
        }

        // Отримуємо студентів, що відповідають на тести в даному курсі
        const students = await User.aggregate([
            { $lookup: {
                from: 'answers',
                localField: '_id',
                foreignField: 'user_id',
                as: 'answers'
            }},
            { $unwind: '$answers' },
            { $match: { 'answers.user_course_id': teacher_id } },
            { $project: {
                id: '$_id',
                name: 1,
                email: 1
            }},
            { $group: {
                _id: '$_id',
                name: { $first: '$name' },
                email: { $first: '$email' }
            }}
        ]);

        res.status(200).json(students);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Failed to retrieve students' });
    }
};


exports.getTeacherAnalytics = (req, res) => {
    const teacherId = req.params.id;

    const query = `
        SELECT 
            COUNT(DISTINCT a.user_id) AS active_students,
            COUNT(DISTINCT a.course_id) AS completed_courses,
            ROUND(AVG((LENGTH(a.answers) - LENGTH(REPLACE(a.answers, ',', '')) + 1)) * 10, 2) AS average_progress
        FROM answers a
        WHERE a.user_course_id = ?;
    `;

    db.get(query, [teacherId], (err, row) => {
        if (err) {
            console.error("Помилка отримання аналітики:", err);
            return res.status(500).json({ error: "Не вдалося отримати аналітику" });
        }

        res.json({
            active_students: row?.active_students || 0,
            completed_courses: row?.completed_courses || 0,
            average_progress: row?.average_progress || 0,
        });
    });
};



exports.setAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Оновлюємо роль користувача до "admin"
        user.role = 'admin';
        await user.save();

        res.status(200).json({ message: 'User role updated to admin successfully' });
    } catch (err) {
        console.error('Error setting admin role:', err);
        res.status(500).json({ error: 'Database error' });
    }
};


// Повне видалення таблиці users
exports.delUsersTable = async (req, res) => {
    try {
        // Видаляємо всіх користувачів
        await User.deleteMany({});
        res.status(200).json({ message: 'All users deleted successfully' });
    } catch (err) {
        console.error('Error deleting users:', err);
        res.status(500).json({ error: 'Failed to delete users' });
    }
};



// Отримати всіх вчителів, у яких publish = 'no'
exports.getAdminTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher', publish: 'no' }, 'id name email created_at');
        res.status(200).json(teachers);
    } catch (err) {
        console.error('Error fetching teachers:', err);
        res.status(500).json({ error: 'Failed to retrieve teachers' });
    }
};



// Оновлення статусу публікації вчителя
exports.updateTeacherStatus = async (req, res) => {
    try {
        const { teacherId, publish } = req.body;

        // Перевірка коректності значення publish
        if (!['yes', 'no', 'canceled'].includes(publish)) {
            return res.status(400).json({ error: 'Invalid publish status' });
        }

        const teacher = await User.findOneAndUpdate(
            { _id: teacherId, role: 'teacher' },
            { publish },
            { new: true }
        );

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found or not a teacher' });
        }

        res.status(200).json({ message: 'Teacher status updated successfully' });
    } catch (err) {
        console.error('Error updating teacher status:', err);
        res.status(500).json({ error: 'Failed to update teacher status' });
    }
};

