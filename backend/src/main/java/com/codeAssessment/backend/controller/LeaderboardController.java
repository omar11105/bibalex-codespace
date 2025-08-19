package com.codeAssessment.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeAssessment.backend.DTO.LeaderboardDTO;
import com.codeAssessment.backend.repository.SubmissionRepository;

@RestController
@RequestMapping("/api")
public class LeaderboardController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @GetMapping("/leaderboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE')")
    public ResponseEntity<List<LeaderboardDTO>> getLeaderboard() {
        List<LeaderboardDTO> leaderboard = submissionRepository.getLeaderboard();
        return ResponseEntity.ok(leaderboard);
    }
}
