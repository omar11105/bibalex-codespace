package com.codeAssessment.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.codeAssessment.backend.DTO.LeaderboardDTO;
import com.codeAssessment.backend.model.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    // This repository interface handles CRUD operations for Submission entities
    List<Submission> findByUser_Email(String email);
    List<Submission> findByUser_EmailOrderBySubmittedAtDesc(String email);
    List<Submission> findByUser_IdOrderBySubmittedAtDesc(Long userId);

    // Custom query to filter submissions by problem ID and email
    @Query("SELECT s FROM Submission s WHERE " +
              "(:problemId IS NULL OR s.problem.id = :problemId) AND " +
              "(:email IS NULL OR s.user.email = :email) ")
              List<Submission> findFilteredSubmissions(@Param("problemId") Long problemId,
                                                    @Param("email") String email);

    // Custom query to get the leaderboard based on submission results and problem difficulties
    @Query("""
            SELECT new com.codeAssessment.backend.DTO.LeaderboardDTO(
            s.user.username,
            s.user.email,
            SUM(
            CASE p.difficulty
            WHEN 'EASY' THEN 10
            WHEN 'MEDIUM' THEN 20
            WHEN 'HARD' THEN 30
            ELSE 0
            END
            )
            ) FROM Submission s
            JOIN s.problem p
            WHERE s.result = 'PASSED'
            GROUP BY s.user.id, s.user.username, s.user.email
            ORDER BY SUM(
            CASE p.difficulty
            WHEN 'EASY' THEN 10
            WHEN 'MEDIUM' THEN 20
            WHEN 'HARD' THEN 30
            ELSE 0
            END
            ) DESC
            """)
    List<LeaderboardDTO> getLeaderboard();
}
