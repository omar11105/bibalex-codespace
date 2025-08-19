package com.codeAssessment.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeAssessment.backend.DTO.AssessmentStartRequest;
import com.codeAssessment.backend.DTO.AssessmentStartResponse;
import com.codeAssessment.backend.DTO.AssessmentSubmitRequest;
import com.codeAssessment.backend.model.AssessmentSession;
import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.service.AssessmentService;

@RestController
@RequestMapping("/api/assessment")
public class CandidateAssessmentController {
    @Autowired
    private AssessmentService assessmentService;

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

    @PostMapping("/practice/start")
    public ResponseEntity<AssessmentStartResponse> startPractice(@RequestBody AssessmentStartRequest request) {
        AssessmentSession session = assessmentService.startPractice(request.getCandidateEmail());
        List<Problem> problems = session.getAssessment().getProblems();

        AssessmentStartResponse response = new AssessmentStartResponse();
        response.setSessionId(session.getId());
        response.setTimeLimit(session.getAssessment().getTimeLimit());
        response.setProblems(problems);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/practice/submit")
    public ResponseEntity<String> submitPracticeScore(@RequestBody AssessmentSubmitRequest request) {
        assessmentService.submitPracticeScore(request.getSessionId(), request.getScore());
        return ResponseEntity.ok("Practice score submitted successfully");
    }
}