package com.codeAssessment.backend.DTO;

import lombok.Data;

@Data
public class AssessmentSubmitRequest {
    private Long sessionId;
    private int score;
}
