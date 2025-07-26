package com.codeAssessment.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Problem {
    // Represents a coding problem in the assessment platform
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Problem details
    @Column(nullable = false, unique = true)
    private String title;

    @Column(columnDefinition= "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(columnDefinition= "TEXT")
    private String sample_input;

    @Column(columnDefinition= "TEXT")
    private String sample_output;

    @Column(columnDefinition= "TEXT")
    private String constraints;

    @Column(columnDefinition= "TEXT")
    private String visual;

    public enum Difficulty {
        EASY,
        MEDIUM,
        HARD
    }
}
