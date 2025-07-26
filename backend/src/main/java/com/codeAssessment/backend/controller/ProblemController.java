package com.codeAssessment.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeAssessment.backend.DTO.ProblemDTO;
import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.model.Submission;
import com.codeAssessment.backend.service.ProblemService;
import com.codeAssessment.backend.service.SubmissionService;

@RestController
@RequestMapping("/api")
public class ProblemController {
    // This controller handles problem management and candidate-specific endpoints

    // Autowired services for problem management and submission handling
    @Autowired
    private ProblemService problemService;
    @Autowired
    private SubmissionService submissionService;

    // Admin endpoints
    @PostMapping("/admin/problems")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Problem> createProblem(@RequestBody ProblemDTO problemDTO) {
        try {
            Problem problem = problemService.createProblem(problemDTO);
            return ResponseEntity.ok(problem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin endpoints for managing problems
    @GetMapping("/admin/problems")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Problem>> getProblems(@RequestParam(required = false) Problem.Difficulty difficulty) {
        try {
            List<Problem> problems;
            if (difficulty != null) {
                problems = problemService.getProblemsByDifficulty(difficulty);
            } else {
                problems = problemService.getAllProblems();
            }
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/admin/problems/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @RequestBody ProblemDTO problemDTO) {
        try {
            Problem problem = problemService.updateProblem(id, problemDTO);
            return ResponseEntity.ok(problem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/admin/problems/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        try {
            problemService.deleteProblem(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Public endpoints for candidates
    @GetMapping("/problems")
    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE')")
    public ResponseEntity<List<Problem>> getAllProblems() {
        try {
            List<Problem> problems = problemService.getAllProblems();
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Endpoint to get a specific problem by ID, accessible by both ADMIN and CANDIDATE roles
    @GetMapping("/problems/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE')")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        try {
            Problem problem = problemService.getProblemById(id);
            return ResponseEntity.ok(problem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Candidate-specific endpoints
    @GetMapping("/candidate/current-problem")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Problem> getCurrentProblem(Principal principal) {
        try {
            String candidateEmail = principal.getName();
            
            // Get the user's recent submissions
            List<Submission> submissions = submissionService.getSubmissionsByCandidate(candidateEmail);
            
            if (!submissions.isEmpty()) {
                // Get the most recent submission's problem
                Submission latestSubmission = submissions.get(0);
                Problem currentProblem = latestSubmission.getProblem();
                return ResponseEntity.ok(currentProblem);
            }
            
            // If no submissions, return the first available problem
            List<Problem> problems = problemService.getAllProblems();
            if (!problems.isEmpty()) {
                return ResponseEntity.ok(problems.get(0));
            }
            
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
