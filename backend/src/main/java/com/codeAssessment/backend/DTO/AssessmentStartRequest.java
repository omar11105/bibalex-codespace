package com.codeAssessment.backend.DTO;

import lombok.Data;


@Data
public class AssessmentStartRequest {
    private String accessCode;
    private String candidateEmail;
}
