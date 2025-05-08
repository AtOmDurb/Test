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
VALUES ('admin', 'admin@school.com', '$2a$10$XZz7sM9sQeBQ9XJ9zT3b5zY7kZ6U9XKJ1mN2L3V4S', 'admin');

-- Пароль: teacher123
INSERT INTO users (username, email, password, role)
VALUES ('teacher1', 'teacher@school.com', '$2a$10$yH8eL5vJXzO7rS3W8F1Qe.BQ9XJ9zT3b5zY7kZ6U9XKJ1mN2L3V4S', 'teacher');

-- Пароль: student123
INSERT INTO users (username, email, password, role)
VALUES ('student1', 'student@school.com', '$2a$10$zK8eL5vJXzO7rS3W8F1Qe.BQ9XJ9zT3b5zY7kZ6U9XKJ1mN2L3V4S', 'student');