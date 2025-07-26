package com.codeAssessment.backend.DTO;

import lombok.Data;

@Data
public class TestCaseResult {
    // This DTO is used to represent the result of a test case execution
    private Long testCaseId;
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private boolean passed;
    private String error;
} 