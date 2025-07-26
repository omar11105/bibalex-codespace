package com.codeAssessment.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.model.TestCase;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    // This repository interface handles CRUD operations for TestCase entities
    List<TestCase> findByProblem(Problem Problem);
}
