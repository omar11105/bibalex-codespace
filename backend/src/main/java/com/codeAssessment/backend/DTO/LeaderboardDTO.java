package com.codeAssessment.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardDTO {
    // This DTO is used to represent a user's position in the leaderboard
    private String username;
    private String email;
    private Long score;

    // Constructors to create a LeaderboardDTO from username, email, and score
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public Long getScore() {
        return score;
    }

}
