package com.codeAssessment.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codeAssessment.backend.DTO.DetailedSubmissionResponse;
import com.codeAssessment.backend.DTO.SubmissionDTO;
import com.codeAssessment.backend.DTO.TestCaseResult;
import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.model.Submission;
import com.codeAssessment.backend.model.TestCase;
import com.codeAssessment.backend.model.User;
import com.codeAssessment.backend.repository.ProblemRepository;
import com.codeAssessment.backend.repository.SubmissionRepository;
import com.codeAssessment.backend.repository.TestCaseRepository;
import com.codeAssessment.backend.repository.UserRepository;

@Service
public class SubmissionService {
    // This service handles the business logic for Submission entities

    // Autowired repositories to perform CRUD operations on Problem, User, TestCase, and Submission entities
    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private PistonService pistonService;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * This method processes a code submission from a candidate.
     * It executes the code against the problem's test cases and returns the results.
     * @param submissionDTO The DTO containing submission details.
     * @param candidateEmail The email of the candidate submitting the code.
     * @return A detailed response containing submission results and test case outcomes.
     */
    public Object submitCode(SubmissionDTO submissionDTO, String candidateEmail) {
        Problem problem = problemRepository.findById(submissionDTO.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        User user = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Execute code with sample input to get output for display
        String sampleInput = problem.getSample_input() != null ? problem.getSample_input() : "";
        String output = "";
        try {
            output = pistonService.executeCode(submissionDTO.getCode(), submissionDTO.getLanguage(), sampleInput);
        } catch (Exception e) {
            output = "Error: " + e.getMessage();
        }

        // If this is a run-only request, return early with just the output
        if (submissionDTO.isRunOnly()) {
            Submission runResult = new Submission();
            runResult.setCode(submissionDTO.getCode());
            runResult.setUser(user);
            runResult.setProblem(problem);
            runResult.setLanguage(submissionDTO.getLanguage());
            runResult.setOutput(output);
            runResult.setResult("RUN");
            runResult.setPassedTests(0);
            runResult.setTotalTests(0);
            return runResult;
        }

        // For actual submissions, run against all test cases
        List<TestCase> testCases = testCaseRepository.findByProblem(problem);
        int passedTests = 0;
        List<TestCaseResult> testCaseResults = new ArrayList<>();

        for (TestCase testCase : testCases) {
            TestCaseResult result = new TestCaseResult();
            result.setTestCaseId(testCase.getId());
            result.setInput(testCase.getInput());
            result.setExpectedOutput(testCase.getOutput());

            try {
                String actualOutput = pistonService.executeCode(submissionDTO.getCode(), submissionDTO.getLanguage(), testCase.getInput());
                result.setActualOutput(actualOutput);
                
                // Compare outputs (trim whitespace for comparison)
                boolean passed = actualOutput.trim().equals(testCase.getOutput().trim());
                result.setPassed(passed);
                
                if (passed) {
                    passedTests++;
                }
            } catch (Exception e) {
                result.setActualOutput("Error: " + e.getMessage());
                result.setPassed(false);
                result.setError(e.getMessage());
            }
            
            testCaseResults.add(result);
        }

        Submission submission = new Submission();
        submission.setCode(submissionDTO.getCode());
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setOutput(output);
        submission.setPassedTests(passedTests);
        submission.setTotalTests(testCases.size());
        submission.setLanguage(submissionDTO.getLanguage());
        submission.setTimeSpent(submissionDTO.getTimeSpent());
        
        String result;
        if (passedTests == testCases.size()) {
            result = "PASSED";
        } else if (passedTests > 0) {
            result = "PARTIALLY PASSED";
        } else {
            result = "FAILED";
        }
        submission.setResult(result);

        // Store the submission
        submission = submissionRepository.save(submission);

        // Return detailed response with test case results
        return DetailedSubmissionResponse.fromSubmission(submission, testCaseResults);
    }

    /**
     * This method retrieves all submissions made by a candidate based on their email.
     * @param candidateEmail The email of the candidate whose submissions are to be retrieved.
     * @return A list of Submission entities made by the candidate.
     */
    public List<Submission> getSubmissionsByCandidate(String candidateEmail) {
        return submissionRepository.findByUser_EmailOrderBySubmittedAtDesc(candidateEmail);
    }

    /**
     * This method retrieves all submissions made by a candidate based on their ID.
     * @param candidateId The ID of the candidate whose submissions are to be retrieved.
     * @return A list of Submission entities made by the candidate.
     */
    public List<Submission> getSubmissionsByCandidateId(Long candidateId) {
        return submissionRepository.findByUser_IdOrderBySubmittedAtDesc(candidateId);
    }

    /**
     * This method retrieves filtered submissions based on problem ID and candidate email.
     * @param problemId The ID of the problem to filter submissions by.
     * @param email The email of the candidate to filter submissions by.
     * @return A list of filtered Submission entities.
     */
    public List<Submission> getFilteredSubmissions(Long problemId, String email) {
        return submissionRepository.findFilteredSubmissions(problemId, email);
    }
}
