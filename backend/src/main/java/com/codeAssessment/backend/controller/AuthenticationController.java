package com.codeAssessment.backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeAssessment.backend.model.User;
import com.codeAssessment.backend.security.JwtUtil;
import com.codeAssessment.backend.service.EmailService;
import com.codeAssessment.backend.service.PasswordResetService;
import com.codeAssessment.backend.service.UserService;
import com.codeAssessment.backend.service.VerificationService;



@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private final EmailService emailService;

    private final VerificationService verificationService;
    private final PasswordResetService passwordResetService;

    public AuthenticationController(UserService userService, JwtUtil jwtUtil, EmailService emailService, VerificationService verificationService, PasswordResetService passwordResetService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.verificationService = verificationService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (user.getRole() == null) {
                user.setRole(User.Role.CANDIDATE); // Default role
            }

            User registeredUser = userService.registerUser(user);
            String token = verificationService.generateVerificationToken(registeredUser);
            
            try {
                emailService.sendVerificationEmail(registeredUser, token);
            } catch (Exception emailException) {
                // Log email failure but don't fail registration
                System.err.println("Email sending failed: " + emailException.getMessage());
            }
            
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam("token") String token) {
        try {
            Optional<User> verified = verificationService.verifyToken(token);
            if (verified.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid or expired token"));
            }
            
            // Save the verified user without re-encrypting password
            User user = verified.get();
            userService.saveUser(user);
            
            return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Verification failed"));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();
        if (user.isVerified()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User already verified"));
        }
        String token = verificationService.generateVerificationToken(user);
        emailService.sendVerificationEmail(user, token);
        return ResponseEntity.ok(Map.of("message", "Verification email resent"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }

            Optional<User> user = userService.authenticate(email, password);
            if (user.isPresent() && user.get().isVerified()) {
                User authenticatedUser = user.get();
                String token = jwtUtil.generateToken(authenticatedUser.getEmail(), authenticatedUser.getRole().name());

                Map<String, Object> response = Map.of(
                    "token", token,
                    "role", authenticatedUser.getRole().name(),
                    "user", Map.of(
                        "id", authenticatedUser.getId(),
                        "username", authenticatedUser.getUsername(),
                        "email", authenticatedUser.getEmail()
                    )
                );
                return ResponseEntity.ok(response);
            } else if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid credentials");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Email not verified");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                // Don't reveal if user exists or not for security
                return ResponseEntity.ok(Map.of("message", "If an account with that email exists, a password reset link has been sent"));
            }

            User user = userOpt.get();
            if (!user.isVerified()) {
                return ResponseEntity.badRequest().body("Please verify your email before requesting a password reset");
            }

            String token = passwordResetService.generatePasswordResetToken(user);
            emailService.sendPasswordResetEmail(user, token);

            return ResponseEntity.ok(Map.of("message", "If an account with that email exists, a password reset link has been sent"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Password reset request failed: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Token is required");
            }
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("New password is required");
            }
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters long");
            }

            boolean success = passwordResetService.resetPassword(token, newPassword);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Password reset failed: " + e.getMessage());
        }
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam("token") String token) {
        try {
            Optional<User> user = passwordResetService.validateToken(token);
            if (user.isPresent()) {
                return ResponseEntity.ok(Map.of("valid", true, "email", user.get().getEmail()));
            } else {
                return ResponseEntity.ok(Map.of("valid", false));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("valid", false, "error", "Token validation failed"));
        }
    }
}
