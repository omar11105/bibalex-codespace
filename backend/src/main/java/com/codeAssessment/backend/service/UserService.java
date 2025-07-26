package com.codeAssessment.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.codeAssessment.backend.model.User;
import com.codeAssessment.backend.repository.UserRepository;

@Service
public class UserService {
    // This service handles user registration and authentication

    // Autowired UserRepository to perform CRUD operations on User entities
    @Autowired
    private UserRepository userRepository;

    // BCryptPasswordEncoder for password encryption
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * This method registers a new user by saving the user entity to the database.
     * It encrypts the user's password before saving.
     * @param user The User entity to be registered.
     * @return The registered User entity.
     */
    public User registerUser(User user) {
        // Encrypt the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * This method authenticates a user by checking the provided email and password.
     * It returns an Optional<User> if authentication is successful.
     * @param email The email of the user to authenticate.
     * @param rawPassword The raw password provided by the user.
     * @return An Optional containing the User if authentication is successful, or empty if not.
     */
    public Optional<User> authenticate(String email, String rawPassword) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(rawPassword, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }
}
