package com.codeAssessment.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.model.Problem.Difficulty;


@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // This repository interface handles CRUD operations for Problem entities
    List<Problem> findAll();
    List<Problem> findByDifficulty(Difficulty difficulty);
}
