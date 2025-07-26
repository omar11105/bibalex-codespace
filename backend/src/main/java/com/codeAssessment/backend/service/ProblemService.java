package com.codeAssessment.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codeAssessment.backend.DTO.ProblemDTO;
import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.repository.ProblemRepository;

@Service
public class ProblemService {
    // This service handles the business logic for Problem entities

    // Autowired ProblemRepository to perform CRUD operations on Problem entities
    @Autowired
    private ProblemRepository problemRepository;

    /**
     * This method creates a new problem based on the provided ProblemDTO.
     * It maps the DTO fields to a Problem entity and saves it to the database.
     * @param problemDTO The DTO containing problem details.
     * @return The created Problem entity.
     */
    public Problem createProblem(ProblemDTO problemDTO) {
        Problem problem = new Problem();
        problem.setTitle(problemDTO.getTitle());
        problem.setDescription(problemDTO.getDescription());
        problem.setDifficulty(Problem.Difficulty.valueOf(problemDTO.getDifficulty().toUpperCase()));
        problem.setSample_input(problemDTO.getSample_input());
        problem.setSample_output(problemDTO.getSample_output());
        problem.setConstraints(problemDTO.getConstraints());
        problem.setVisual(problemDTO.getVisual());
        return problemRepository.save(problem);
    }

    /**
     * This method retrieves all problems from the database.
     * @return A list of Problem entities.
     */
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    /**
     * This method retrieves a problem by its ID.
     * @param id The ID of the problem to retrieve.
     * @return The Problem entity with the specified ID.
     */
    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    /**
     * This method updates an existing problem based on the provided ProblemDTO.
     * It maps the DTO fields to the existing Problem entity and saves the updated entity.
     * @param id The ID of the problem to update.
     * @param problemDTO The DTO containing updated problem details.
     * @return The updated Problem entity.
     */
    public Problem updateProblem(Long id, ProblemDTO problemDTO) {
        Problem problem = problemRepository.findById(id).orElseThrow();
        problem.setTitle(problemDTO.getTitle());
        problem.setDescription(problemDTO.getDescription());
        problem.setDifficulty(Problem.Difficulty.valueOf(problemDTO.getDifficulty().toUpperCase()));
        problem.setSample_input(problemDTO.getSample_input());
        problem.setSample_output(problemDTO.getSample_output());
        problem.setConstraints(problemDTO.getConstraints());
        problem.setVisual(problemDTO.getVisual());
        return problemRepository.save(problem);
    }

    /**
     * This method deletes a problem by its ID.
     * @param id The ID of the problem to delete.
     */
    public void deleteProblem(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        problemRepository.delete(problem);
    }

    /**
     * This method retrieves problems by their difficulty level.
     * @param difficulty The difficulty level to filter problems.
     * @return A list of Problem entities with the specified difficulty.
     */
    public List<Problem> getProblemsByDifficulty(Problem.Difficulty difficulty) {
        return problemRepository.findByDifficulty(difficulty);
    }

}
