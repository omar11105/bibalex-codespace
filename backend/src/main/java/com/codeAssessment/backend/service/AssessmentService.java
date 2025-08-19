package com.codeAssessment.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codeAssessment.backend.model.Assessment;
import com.codeAssessment.backend.model.AssessmentSession;
import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.repository.AssessmentRepository;
import com.codeAssessment.backend.repository.AssessmentSessionRepository;
import com.codeAssessment.backend.repository.ProblemRepository;

@Service
public class AssessmentService {
    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private AssessmentSessionRepository assessmentSessionRepository;

    @Autowired
    private ProblemRepository problemRepository;

    public Assessment createAssessment(List<Long> problemIds, int timeLimit) {
        List<Problem> problems = problemRepository.findAllById(problemIds);
        
        Assessment assessment = new Assessment();
        assessment.setProblems(problems);
        assessment.setAccessCode(UUID.randomUUID().toString().substring(0, 8));
        assessment.setTimeLimit(timeLimit);
        assessment.setActive(true);
        assessment.setCreatedAt(LocalDateTime.now());

        return assessmentRepository.save(assessment);
    }

    public AssessmentSession startAssessment(String accessCode, String candidateEmail) {
        Assessment assessment = assessmentRepository.findByAccessCode(accessCode)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        if (!assessment.isActive()) {
            throw new RuntimeException("Assessment is not active");
        }

        // Prevent duplicate sessions for the same candidate
        AssessmentSession existingSession = assessmentSessionRepository.findByAssessmentAndCandidateEmail(assessment, candidateEmail);
        if (existingSession != null) {
            throw new RuntimeException("You have already started this assessment");
        }

        AssessmentSession session = new AssessmentSession();
        session.setAssessment(assessment);
        session.setCandidateEmail(candidateEmail);
        session.setStartTime(LocalDateTime.now());
        session.setCompleted(false);
        session.setScore(0);

        return assessmentSessionRepository.save(session);
    }

    public void submitScore(Long sessionId, int score) {
        AssessmentSession session = assessmentSessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.isCompleted()) {
            throw new RuntimeException("Assessment already submitted");
        }

        session.setScore(score);
        session.setCompleted(true);
        session.setSubmittedAt(LocalDateTime.now());
        assessmentSessionRepository.save(session);
    }

    public List<Assessment> getAllAssessments() {
        List<Assessment> allAssessments = assessmentRepository.findAll();
        // Filter out practice assessments (those with access codes starting with "PRACTICE-")
        return allAssessments.stream()
            .filter(assessment -> assessment.getAccessCode() != null &&
                                  !assessment.getAccessCode().startsWith("PRACTICE-"))
            .collect(java.util.stream.Collectors.toList());
    }

    public List<Assessment> getPracticeAssessments() {
        List<Assessment> allAssessments = assessmentRepository.findAll();
        // Return only practice assessments (those with access codes starting with "PRACTICE-")
        return allAssessments.stream()
            .filter(assessment -> assessment.getAccessCode() != null &&
                                  assessment.getAccessCode().startsWith("PRACTICE-"))
            .collect(java.util.stream.Collectors.toList());
    }

    public List<AssessmentSession> getAllAssessmentSessions() {
        List<AssessmentSession> allSessions = assessmentSessionRepository.findAll();
        // Filter out practice sessions (those with access codes starting with "PRACTICE-")
        return allSessions.stream()
            .filter(session -> session.getAssessment() != null && 
                              session.getAssessment().getAccessCode() != null &&
                              !session.getAssessment().getAccessCode().startsWith("PRACTICE-"))
            .collect(java.util.stream.Collectors.toList());
    }

    public List<AssessmentSession> getPracticeSessions() {
        List<AssessmentSession> allSessions = assessmentSessionRepository.findAll();
        // Return only practice sessions (those with access codes starting with "PRACTICE-")
        return allSessions.stream()
            .filter(session -> session.getAssessment() != null && 
                              session.getAssessment().getAccessCode() != null &&
                              session.getAssessment().getAccessCode().startsWith("PRACTICE-"))
            .collect(java.util.stream.Collectors.toList());
    }

    public void deactivateAssessment(Long id) {
        Assessment assessment = assessmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assessment not found"));
        
        assessment.setActive(false);
        assessmentRepository.save(assessment);
    }

    public Assessment duplicateAssessment(Long id) {
        Assessment originalAssessment = assessmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assessment not found"));
        
        Assessment newAssessment = new Assessment();
        // Create a new list to avoid JPA relationship issues
        newAssessment.setProblems(new ArrayList<>(originalAssessment.getProblems()));
        newAssessment.setAccessCode(UUID.randomUUID().toString().substring(0, 8));
        newAssessment.setTimeLimit(originalAssessment.getTimeLimit());
        newAssessment.setActive(true);
        newAssessment.setCreatedAt(LocalDateTime.now());

        return assessmentRepository.save(newAssessment);
    }

    public AssessmentSession startPractice(String candidateEmail) {
        // Get all available problems for practice mode
        List<Problem> allProblems = problemRepository.findAll();
        
        if (allProblems.isEmpty()) {
            throw new RuntimeException("No problems available for practice");
        }

        // Randomly select 2-5 problems for practice session
        int numProblems = (int) (Math.random() * 4) + 2; // 2 to 5 problems
        List<Problem> selectedProblems = new ArrayList<>();
        
        // Shuffle and select random problems
        java.util.Collections.shuffle(allProblems);
        selectedProblems = allProblems.subList(0, Math.min(numProblems, allProblems.size()));

        // Calculate time limit based on problem difficulties
        int totalTime = 0;
        for (Problem problem : selectedProblems) {
            switch (problem.getDifficulty()) {
                case EASY:
                    totalTime += 10;
                    break;
                case MEDIUM:
                    totalTime += 20;
                    break;
                case HARD:
                    totalTime += 30;
                    break;
            }
        }

        // Create a practice assessment with dynamic time allocation
        Assessment practiceAssessment = new Assessment();
        practiceAssessment.setProblems(selectedProblems);
        practiceAssessment.setAccessCode("PRACTICE-" + UUID.randomUUID().toString().substring(0, 8));
        practiceAssessment.setTimeLimit(totalTime);
        practiceAssessment.setActive(true);
        practiceAssessment.setCreatedAt(LocalDateTime.now());
        practiceAssessment = assessmentRepository.save(practiceAssessment);

        // Create practice session
        AssessmentSession session = new AssessmentSession();
        session.setAssessment(practiceAssessment);
        session.setCandidateEmail(candidateEmail);
        session.setStartTime(LocalDateTime.now());
        session.setCompleted(false);
        session.setScore(0);

        return assessmentSessionRepository.save(session);
    }

    public void submitPracticeScore(Long sessionId, int score) {
        AssessmentSession session = assessmentSessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Practice session not found"));

        if (session.isCompleted()) {
            throw new RuntimeException("Practice session already submitted");
        }

        session.setScore(score);
        session.setCompleted(true);
        session.setSubmittedAt(LocalDateTime.now());
        assessmentSessionRepository.save(session);
    }
}

        
