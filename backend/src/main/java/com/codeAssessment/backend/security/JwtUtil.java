package com.codeAssessment.backend.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    // This utility class handles JWT

    // Value properties for JWT secret and expiration time
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private long jwtExpirationMs;

    /**
     * This method generates a signing key from the JWT secret.
     * It uses HMAC SHA-512 algorithm for signing the JWT tokens.
     * @return Key used for signing JWT tokens.
     */
    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * This method generates a JWT token for a given username and role.
     * @param username The username for which the token is generated.
     * @param role The role of the user (e.g., ADMIN, CANDIDATE).
     * @return A signed JWT token.
     */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * This method extracts the username from a JWT token.
     * @param token The JWT token from which the username is extracted.
     * @return The username contained in the JWT token.
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    /**
     * This method extracts the role from a JWT token.
     * @param token The JWT token from which the role is extracted.
     * @return The role contained in the JWT token.
     */
    public String getRoleFromToken(String token) {
        return (String) Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token)
                .getBody().get("role", String.class);
    }

    /**
     * This method validates a JWT token.
     * It checks if the token is correctly signed and not expired.
     * @param token The JWT token to validate.
     * @return true if the token is valid, false otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false; // Token is invalid
        }
    }
}
