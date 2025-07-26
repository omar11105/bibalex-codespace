package com.codeAssessment.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeAssessment.backend.DTO.SubmissionDTO;
import com.codeAssessment.backend.model.Submission;
import com.codeAssessment.backend.service.SubmissionService;

@RestController
@RequestMapping("/api/candidate")
@PreAuthorize("hasRole('CANDIDATE')")
public class SubmissionController {
    // This controller handles candidate-specific endpoints for managing submissions
    @Autowired
    private SubmissionService submissionService;

    // Endpoint for candidates to submit code, accessible only by CANDIDATE role
    @PostMapping("/submissions")
    public ResponseEntity<Object> createSubmission(@RequestBody SubmissionDTO submissionDTO, Principal principal) {
        try {
            String candidateEmail = principal.getName();
            Object result = submissionService.submitCode(submissionDTO, candidateEmail);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Endpoint for candidates to view their submissions
    @GetMapping("/submissions")
    public ResponseEntity<List<Submission>> getSubmissions(Principal principal) {
        try {
            String candidateEmail = principal.getName();
            List<Submission> submissions = submissionService.getSubmissionsByCandidate(candidateEmail);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Endpoint to get submissions by candidate ID, with optional limit
    @GetMapping("/{candidateId}/submissions")
    public ResponseEntity<List<Submission>> getSubmissionsByCandidateId(
            @PathVariable Long candidateId,
            @RequestParam(required = false) Integer limit) {
        try {
            List<Submission> submissions = submissionService.getSubmissionsByCandidateId(candidateId);
            if (limit != null && limit > 0) {
                submissions = submissions.subList(0, Math.min(limit, submissions.size()));
            }
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
