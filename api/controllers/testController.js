const db = require('../database');
const path = require('path');

// Create a test
exports.createTest = (req, res) => {
    const { course_id, questions } = req.body;

    // Validate required fields
    if (!course_id || !questions) {
        return res.status(400).json({ error: 'Course ID, and questions are required' });
    }

    // Перетворюємо масив питань у JSON-рядок перед збереженням
    const questionsJson = JSON.stringify(questions);

    const query = `
      INSERT INTO tests (course_id, title, questions)
      VALUES (?, ?, ?)
    `;

    const title = 'Test name';

    db.run(query, [course_id, title, questionsJson], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to add test' });
        }
        res.status(201).json({ id: this.lastID, message: 'Test added successfully' });
    });
};

// Get all tests
exports.getTests = (req, res) => {
    const query = `SELECT * FROM tests`;
    db.all(query, (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch tests' });
        }

        // Розпарсити питання з JSON-рядка у масив перед поверненням
        const formattedRows = rows.map(test => ({
            ...test,
            questions: JSON.parse(test.questions)
        }));

        res.status(200).json(formattedRows);
    });
};

// Get a test by ID
exports.getTestById = (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM tests WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch test' });
        }
        if (!row) return res.status(404).json({ error: 'Test not found' });

        // Розпарсити питання
        row.questions = JSON.parse(row.questions);

        res.status(200).json(row);
    });
};

// Update a test
exports.updateTest = (req, res) => {
    const { id } = req.params;
    const { course_id, title, questions } = req.body;

    const questionsJson = JSON.stringify(questions);

    const query = `
      UPDATE tests
      SET course_id = ?, title = ?, questions = ?
      WHERE id = ?
    `;

    db.run(query, [course_id, title, questionsJson, id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to update test' });
        }
        if (this.changes === 0) return res.status(404).json({ error: 'Test not found' });
        res.status(200).json({ message: 'Test updated successfully' });
    });
};

// Delete a test
exports.deleteTest = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM tests WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to delete test' });
        }
        if (this.changes === 0) return res.status(404).json({ error: 'Test not found' });
        res.status(200).json({ message: 'Test deleted successfully' });
    });
};

// Get tests by course ID
exports.getTestsByCourseId = (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM tests WHERE course_id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch test' });
        }
        if (!row) return res.status(404).json({ error: 'Test not found' });

        // Розпарсити питання
        row.questions = JSON.parse(row.questions);

        res.status(200).json(row);
    });
};


// Save or update test answers and result
exports.saveTestResults = (req, res) => {
    const { test_id, course_id, user_course_id, user_id, answers } = req.body;

    // Перевіряємо, чи всі поля передано
    if (!test_id || !user_id || !answers) {
        return res.status(400).json({ error: 'Test ID, user ID, and answers are required' });
    }

    // Перетворюємо масив відповідей у JSON-рядок перед збереженням
    const answersJson = JSON.stringify(answers);

    // Спочатку перевіряємо, чи вже існує запис для цього користувача та тесту
    const checkQuery = `SELECT id FROM answers WHERE test_id = ? AND user_id = ?`;

    db.get(checkQuery, [test_id, user_id], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error during checking answers' });
        }

        if (row) {
            // Якщо запис існує, оновлюємо його
            const updateQuery = `
                UPDATE answers 
                SET answers = ?, course_id = ?, user_course_id = ?
                WHERE id = ?
            `;

            db.run(updateQuery, [answersJson, course_id, user_course_id, row.id], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Failed to update answers' });
                }

                res.status(200).json({ message: 'Answers updated successfully', id: row.id });
            });
        } else {
            // Якщо запису немає, створюємо новий
            const insertQuery = `
                INSERT INTO answers (test_id, user_id, answers, course_id, user_course_id)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.run(insertQuery, [test_id, user_id, answersJson, course_id, user_course_id], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Failed to save answers' });
                }

                res.status(201).json({ message: 'Answers saved successfully', id: this.lastID });
            });
        }
    });
};


// Get test results by user ID
exports.getTestResultsByUser = (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const query = `
      SELECT answers.id, answers.test_id, tests.title, answers.answers
      FROM answers
      JOIN tests ON answers.test_id = tests.id
      WHERE answers.user_id = ?
    `;

    db.all(query, [user_id], (err, rows) => {
        if (err) {
            console.error('Помилка отримання результатів тестів:', err.message);
            return res.status(500).json({ error: 'Failed to fetch test results' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No test results found for this user' });
        }

        // Розпарсимо відповіді з JSON-рядка
        const formattedResults = rows.map(result => ({
            id: result.id,
            test_id: result.test_id,
            test_title: result.title,
            answers: JSON.parse(result.answers)
        }));

        res.status(200).json(formattedResults);
    });
};


// Clear all records from the answers table
exports.clearAnswersTable = (req, res) => {
    const query = `DELETE FROM answers`;

    db.run(query, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to clear answers table' });
        }

        res.status(200).json({ message: 'Answers table cleared successfully', rowsAffected: this.changes });
    });
};
