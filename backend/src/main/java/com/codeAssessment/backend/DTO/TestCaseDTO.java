package com.codeAssessment.backend.DTO;

import lombok.Data;

@Data
public class TestCaseDTO {
    // This DTO is used to represent a test case for a problem
    private String input;
    private String output;
    private Long problemId;
}
