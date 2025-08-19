package com.codeAssessment.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.codeAssessment.backend.model.Problem;
import com.codeAssessment.backend.repository.ProblemRepository;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Autowired
	private ProblemRepository problemRepository;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Initialize sample problems if database is empty
		if (problemRepository.count() == 0) {
			Problem problem1 = new Problem();
			problem1.setTitle("Reverse String");
			problem1.setDescription("Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.");
			problem1.setDifficulty(Problem.Difficulty.EASY);
			problem1.setSample_input("['h','e','l','l','o']");
			problem1.setSample_output("['o','l','l','e','h']");
			problemRepository.save(problem1);

			Problem problem2 = new Problem();
			problem2.setTitle("Two Sum");
			problem2.setDescription("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.");
			problem2.setDifficulty(Problem.Difficulty.EASY);
			problem2.setSample_input("[2,7,11,15], target = 9");
			problem2.setSample_output("[0,1]");
			problemRepository.save(problem2);

			Problem problem3 = new Problem();
			problem3.setTitle("Zigzag Traversal");
			problem3.setDescription("Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).");
			problem3.setDifficulty(Problem.Difficulty.MEDIUM);
			problem3.setSample_input("[3,9,20,null,null,15,7]");
			problem3.setSample_output("[[3],[20,9],[15,7]]");
			problemRepository.save(problem3);
		}
	}
}
