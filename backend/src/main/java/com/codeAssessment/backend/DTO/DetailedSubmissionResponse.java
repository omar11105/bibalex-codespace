package com.codeAssessment.backend.DTO;

import java.time.LocalDateTime;
import java.util.List;

import com.codeAssessment.backend.model.Submission;

import lombok.Data;

@Data
public class DetailedSubmissionResponse {
    // This DTO is used to provide detailed information about a submission, including test case results
    private Long id;
    private String code;
    private String output;
    private String language;
    private String result;
    private int passedTests;
    private int totalTests;
    private Long timeSpent;
    private LocalDateTime submittedAt;
    private List<TestCaseResult> testCaseResults;
    
    // Static method to create a DetailedSubmissionResponse from a Submission object and a list of test case results
    public static DetailedSubmissionResponse fromSubmission(Submission submission, List<TestCaseResult> testCaseResults) {
        DetailedSubmissionResponse response = new DetailedSubmissionResponse();
        response.setId(submission.getId());
        response.setCode(submission.getCode());
        response.setOutput(submission.getOutput());
        response.setLanguage(submission.getLanguage());
        response.setResult(submission.getResult());
        response.setPassedTests(submission.getPassedTests());
        response.setTotalTests(submission.getTotalTests());
        response.setTimeSpent(submission.getTimeSpent());
        response.setSubmittedAt(submission.getSubmittedAt());
        response.setTestCaseResults(testCaseResults);
        return response;
    }
} 