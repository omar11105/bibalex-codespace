package com.codeAssessment.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeAssessment.backend.model.PasswordResetToken;
import com.codeAssessment.backend.model.User;
import com.codeAssessment.backend.repository.PasswordResetTokenRepository;
import com.codeAssessment.backend.repository.UserRepository;

@Service
public class PasswordResetService {
    
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${app.password-reset.token.ttl:30}")
    private long passwordResetTokenTtl; // Default 30 minutes

    public PasswordResetService(PasswordResetTokenRepository passwordResetTokenRepository, UserRepository userRepository) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Transactional
    public String generatePasswordResetToken(User user) {
        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);
        
        // Create new token
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusMinutes(passwordResetTokenTtl));
        
        passwordResetTokenRepository.save(token);
        return token.getToken();
    }

    @Transactional
    public Optional<User> validateToken(String token) {
        return passwordResetTokenRepository.findByToken(token).map(passwordResetToken -> {
            if (passwordResetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return null; // Token expired
            }
            return passwordResetToken.getUser();
        });
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            return false;
        }
        
        PasswordResetToken passwordResetToken = tokenOpt.get();
        
        if (passwordResetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false; // Token expired
        }
        
        User user = passwordResetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        
        // Save the updated user
        userRepository.save(user);
        
        // Delete the used token
        passwordResetTokenRepository.delete(passwordResetToken);
        
        return true;
    }

    public boolean tokenExpired(String token) {
        return passwordResetTokenRepository.findByToken(token)
            .map(passwordResetToken -> passwordResetToken.getExpiryDate().isBefore(LocalDateTime.now()))
            .orElse(true);
    }
} 