package com.codeAssessment.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codeAssessment.backend.model.AssessmentSession;

@Repository
public interface AssessmentSessionRepository extends JpaRepository<AssessmentSession, Long> {
    List<AssessmentSession> findByCandidateEmail(String candidateEmail);
    AssessmentSession findByAssessmentAndCandidateEmail(com.codeAssessment.backend.model.Assessment assessment, String candidateEmail);
}
