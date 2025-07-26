package com.codeAssessment.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeAssessment.backend.model.User;
import com.codeAssessment.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {
    // Injecting UserRepository to handle user-related database operations
    private final UserRepository userRepository;

    // Constructor-based dependency injection for UserRepository
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Endpoints for user management
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Endpoint to create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
