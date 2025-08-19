package com.codeAssessment.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeAssessment.backend.DTO.AssessmentCreateRequest;
import com.codeAssessment.backend.DTO.AssessmentStartRequest;
import com.codeAssessment.backend.DTO.AssessmentStartResponse;
import com.codeAssessment.backend.DTO.AssessmentSubmitRequest;
import com.codeAssessment.backend.model.Assessment;
import com.codeAssessment.backend.model.AssessmentSession;
import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.service.AssessmentService;

@RestController
@RequestMapping("/api/admin/assessment")
public class AssessmentController {
    // Manages assessment lifecycle: creation, activation, session management, and scoring
    
    @Autowired
    private AssessmentService assessmentService;

    @PostMapping("/create")
    public ResponseEntity<Assessment> createAssessment(@RequestBody AssessmentCreateRequest request) {
        Assessment assessment = assessmentService.createAssessment(
            request.getProblemIds(),
            request.getTimeLimit()
        );
        return ResponseEntity.ok(assessment);
    }

    @PostMapping("/start")
    public ResponseEntity<AssessmentStartResponse> startAssessment(@RequestBody AssessmentStartRequest request) {
        AssessmentSession session = assessmentService.startAssessment(
            request.getAccessCode(),
            request.getCandidateEmail()
        );
        List<Problem> problems = session.getAssessment().getProblems();

        AssessmentStartResponse response = new AssessmentStartResponse();
        response.setSessionId(session.getId());
        response.setTimeLimit(session.getAssessment().getTimeLimit());
        response.setProblems(problems);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitScore(@RequestBody AssessmentSubmitRequest request) {
        assessmentService.submitScore(request.getSessionId(), request.getScore());
        return ResponseEntity.ok("Score submitted successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Assessment>> getAllAssessments() {
        List<Assessment> assessments = assessmentService.getAllAssessments();
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<AssessmentSession>> getAssessmentSessions() {
        List<AssessmentSession> sessions = assessmentService.getAllAssessmentSessions();
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateAssessment(@PathVariable Long id) {
        assessmentService.deactivateAssessment(id);
        return ResponseEntity.ok("Assessment deactivated successfully");
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<Assessment> duplicateAssessment(@PathVariable Long id) {
        Assessment newAssessment = assessmentService.duplicateAssessment(id);
        return ResponseEntity.ok(newAssessment);
    }

}
