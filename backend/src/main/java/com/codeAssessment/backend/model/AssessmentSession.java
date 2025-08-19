package com.codeAssessment.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class AssessmentSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String candidateEmail;

    @ManyToOne
    @JsonBackReference
    private Assessment assessment;

    // Getter for assessment ID to avoid serialization issues
    public Long getAssessmentId() {
        return assessment != null ? assessment.getId() : null;
    }

    private LocalDateTime startTime;

    private LocalDateTime submittedAt;

    private boolean completed;

    private int score;
}
