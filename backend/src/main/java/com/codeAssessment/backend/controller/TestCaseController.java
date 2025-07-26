package com.codeAssessment.backend.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.codeAssessment.backend.DTO.TestCaseDTO;
import com.codeAssessment.backend.model.TestCase;
import com.codeAssessment.backend.service.TestCaseService;

@RestController
@RequestMapping("/api/admin/testcases")
@PreAuthorize("hasRole('ADMIN')")
public class TestCaseController {
    // This controller handles admin-specific endpoints for managing test cases
    // Autowired service for test case management
    @Autowired
    private TestCaseService testCaseService;

    // Endpoint to create a new test case, accessible only by ADMIN role
    @PostMapping
    public ResponseEntity<TestCase> createTestCase(@RequestBody TestCaseDTO testCaseDTO) {
        try {
            TestCase testCase = testCaseService.createTestCase(testCaseDTO);
            return ResponseEntity.ok(testCase);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint to retrieve all test cases for a specific problem
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<TestCase>> getTestCasesByProblem(@PathVariable Long problemId) {
        try {
            List<TestCase> testCases = testCaseService.getTestCasesByProblem(problemId);
            return ResponseEntity.ok(testCases);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Endpoint to update a test case by ID
    @PutMapping("/{id}")
    public ResponseEntity<TestCase> updateTestCase(@PathVariable Long id, @RequestBody TestCaseDTO testCaseDTO) {
        try {
            TestCase testCase = testCaseService.updateTestCase(id, testCaseDTO);
            return ResponseEntity.ok(testCase);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint to delete a test case by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestCase(@PathVariable Long id) {
        try {
            testCaseService.deleteTestCase(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
