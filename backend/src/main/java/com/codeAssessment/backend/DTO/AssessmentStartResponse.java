package com.codeAssessment.backend.DTO;

import java.util.List;

import com.codeAssessment.backend.model.Problem;

import lombok.Data;

@Data
public class AssessmentStartResponse {
    private Long sessionId;
    private int timeLimit;
    private List<Problem> problems;
}
