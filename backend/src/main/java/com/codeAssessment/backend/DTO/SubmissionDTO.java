package com.codeAssessment.backend.DTO;

import lombok.Data;

@Data
public class SubmissionDTO {
    // This DTO is used to represent a submission made by a user
    private String code;
    private String language;
    private Long problemId;
    private boolean runOnly = false;
    private Long timeSpent;
}
