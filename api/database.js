const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

// Створення таблиць
db.serialize(() => {
  // Таблиця користувачів
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        publish VARCHAR DEFAULT 'yes' CHECK(publish IN ('yes', 'no', 'canceled')),
        role VARCHAR NOT NULL CHECK(role IN ('user', 'teacher', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        token VARCHAR
    );
`);

  // Таблиця курсів
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR NOT NULL,
      description VARCHAR NOT NULL,
      article TEXT NOT NULL,
      video_link VARCHAR,
      publish VARCHAR,
      img VARCHAR,
      files VARCHAR,
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Таблиця тестів
  db.run(`
    CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      title VARCHAR NOT NULL,
      questions TEXT NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);

  // Таблиця відповідей
  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_id INTEGER,
      course_id INTEGER,
      user_course_id INTEGER,
      user_id INTEGER,
      answers TEXT NOT NULL,
      FOREIGN KEY (test_id) REFERENCES tests(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
