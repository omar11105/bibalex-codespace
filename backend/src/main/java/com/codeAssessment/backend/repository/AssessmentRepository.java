package com.codeAssessment.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codeAssessment.backend.model.Assessment;

@Repository
public interface  AssessmentRepository extends JpaRepository<Assessment, Long> {
    Optional<Assessment> findByAccessCode(String accessCode);
}
