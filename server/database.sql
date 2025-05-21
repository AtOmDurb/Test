CREATE DATABASE school_db;

USE school_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'student') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Пароль: admin123
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@school.com', 'admin123', 'admin');

-- Пароль: teacher123
INSERT INTO users (username, email, password, role)
VALUES ('teacher1', 'teacher@school.com', 'teacher123', 'teacher');

-- Пароль: student123
INSERT INTO users (username, email, password, role)
VALUES ('student1', 'student@school.com', 'student123', 'student');


