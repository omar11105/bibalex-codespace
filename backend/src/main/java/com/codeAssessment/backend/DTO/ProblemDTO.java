package com.codeAssessment.backend.DTO;

import lombok.Data;

@Data
public class ProblemDTO {
    // This DTO is used to represent a problem in the coding platform
    private String title;
    private String description;
    private String difficulty;
    private String sample_input;
    private String sample_output;
    private String constraints;
    private String visual;
}
