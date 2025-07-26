CREATE DATABASE IF NOT EXISTS ba_code_assessment;
USE ba_code_assessment;

CREATE TABLE user (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CANDIDATE','ADMIN') NOT NULL
);

CREATE TABLE problem (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    difficulty ENUM('EASY','MEDIUM','HARD') NOT NULL,
    sample_input TEXT,
    sample_output TEXT
);

CREATE TABLE test_case (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    problem_id BIGINT NOT NULL,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    FOREIGN KEY (problem_id) REFERENCES problem(id) ON DELETE CASCADE
);

CREATE TABLE submission (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    problem_id BIGINT NOT NULL,
    code TEXT NOT NULL,
    output TEXT,
    language VARCHAR(100) NOT NULL,
    result VARCHAR(50) NOT NULL,
    passed_tests INT DEFAULT 0,
    total_tests INT DEFAULT 0,
    time_spent BIGINT DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problem(id) ON DELETE CASCADE
);