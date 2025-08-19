package com.codeAssessment.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.codeAssessment.backend.model.User;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;

    @Value("${app.frontend.baseUrl:http://localhost:3000}")
    private String frontendBaseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(User user, String token) {
        try {
            String link = frontendBaseUrl + "/verify?token=" + token;
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Verify Your Email - Code Assessment Platform");
            message.setText(
                "Hello " + user.getUsername() + ",\n\n" +
                "Thank you for registering with our Code Assessment Platform!\n\n" +
                "Please click the following link to verify your email address:\n" +
                link + "\n\n" +
                "This verification link will expire in 24 hours for security reasons.\n\n" +
                "If you didn't create this account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Code Assessment Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't fail the registration
            System.err.println("Failed to send verification email: " + e.getMessage());
            // In production, you might want to use a proper logger
        }
    }

    public void sendPasswordResetEmail(User user, String token) {
        try {
            String link = frontendBaseUrl + "/reset-password?token=" + token;
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Password Reset Request - Code Assessment Platform");
            message.setText(
                "Hello " + user.getUsername() + ",\n\n" +
                "You have requested to reset your password for your Code Assessment Platform account.\n\n" +
                "Please click the following link to reset your password:\n" +
                link + "\n\n" +
                "This password reset link will expire in 30 minutes for security reasons.\n\n" +
                "If you didn't request this password reset, please ignore this email and your password will remain unchanged.\n\n" +
                "Best regards,\n" +
                "Code Assessment Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't fail the password reset request
            System.err.println("Failed to send password reset email: " + e.getMessage());
            // In production, you might want to use a proper logger
        }
    }
}