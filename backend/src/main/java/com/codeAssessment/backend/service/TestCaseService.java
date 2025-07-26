package com.codeAssessment.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codeAssessment.backend.DTO.TestCaseDTO;
import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.model.TestCase;
import com.codeAssessment.backend.repository.ProblemRepository;
import com.codeAssessment.backend.repository.TestCaseRepository;

@Service
public class TestCaseService {
    // This service handles the business logic for TestCase entities

    // Autowired TestCaseRepository to perform CRUD operations on TestCase entities
    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private ProblemRepository problemRepository;

    /**
     * This method creates a new test case based on the provided TestCaseDTO.
     * It maps the DTO fields to a TestCase entity and saves it to the database.
     * @param testCaseDTO The DTO containing test case details.
     * @return The created TestCase entity.
     */
    public TestCase createTestCase(TestCaseDTO testCaseDTO) {
        Problem problem = problemRepository.findById(testCaseDTO.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        TestCase testCase = new TestCase();
        testCase.setInput(testCaseDTO.getInput());
        testCase.setOutput(testCaseDTO.getOutput());
        testCase.setProblem(problem);

        return testCaseRepository.save(testCase);
    }

    /**
     * This method retrieves all test cases for a specific problem.
     * @param problemId The ID of the problem to retrieve test cases for.
     * @return A list of TestCase entities associated with the specified problem.
     */
    public List<TestCase> getTestCasesByProblemId(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        return testCaseRepository.findByProblem(problem);
    }

    public List<TestCase> getTestCasesByProblem(Long problemId) {
        return getTestCasesByProblemId(problemId);
    }

    /**
     * This method deletes a test case by its ID.
     * @param id The ID of the test case to delete.
     */
    public void deleteTestCase(Long id) {
        if (!testCaseRepository.existsById(id)) {
            throw new RuntimeException("Test Case not found");
        }
        testCaseRepository.deleteById(id);
    }

    /**
     * This method updates an existing test case based on the provided TestCaseDTO.
     * It maps the DTO fields to the existing TestCase entity and saves the updated entity.
     * @param id The ID of the test case to update.
     * @param testCaseDTO The DTO containing updated test case details.
     * @return The updated TestCase entity.
     */
    public TestCase updateTestCase(Long id, TestCaseDTO testCaseDTO) {
        TestCase testCase = testCaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test Case not found"));

        Problem problem = problemRepository.findById(testCaseDTO.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        testCase.setInput(testCaseDTO.getInput());
        testCase.setOutput(testCaseDTO.getOutput());
        testCase.setProblem(problem);

        return testCaseRepository.save(testCase);
    }
}
