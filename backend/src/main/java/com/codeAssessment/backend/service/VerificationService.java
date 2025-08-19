package com.codeAssessment.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeAssessment.backend.model.User;
import com.codeAssessment.backend.model.VerificationToken;
import com.codeAssessment.backend.repository.VerificationTokenRepository;

@Service
public class VerificationService {
    private final VerificationTokenRepository verificationTokenRepository;

    @Value("${app.verification.token.ttl:1440}")
    private long verificationTokenTtl;

    public VerificationService(VerificationTokenRepository verificationTokenRepository) {
        this.verificationTokenRepository = verificationTokenRepository;
    }

    @Transactional
    public String generateVerificationToken(User user) {
        verificationTokenRepository.deleteByUser(user);
        VerificationToken token = new VerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusMinutes(verificationTokenTtl));
        verificationTokenRepository.save(token);
        return token.getToken();
    }

    @Transactional
    public Optional<User> verifyToken(String token) {
        return verificationTokenRepository.findByToken(token).map(verificationToken -> {
            if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return null;
            }
            User user = verificationToken.getUser();
            user.setVerified(true);
            verificationTokenRepository.delete(verificationToken);
            return user;
        });
    }

    public boolean tokenExpired(String token) {
        return verificationTokenRepository.findByToken(token)
            .map(verificationToken -> verificationToken.getExpiryDate().isBefore(LocalDateTime.now()))
            .orElse(true);
    }
}
