package com.codeAssessment.backend.DTO;

import java.util.List;

import lombok.Data;

@Data
public class AssessmentCreateRequest {
    private List<Long> problemIds;
    private int timeLimit;
}
