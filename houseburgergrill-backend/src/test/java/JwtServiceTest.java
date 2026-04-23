package br.com.houseburgergrill.backend.security.service;

import br.com.houseburgergrill.backend.config.properties.AppProperties;
import br.com.houseburgergrill.backend.user.model.Role;
import br.com.houseburgergrill.backend.user.model.User;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtServiceTest {

    private JwtService jwtService;
    private AppProperties appProperties;
    private User testUser;

    @BeforeEach
    void setup() {
        appProperties = new AppProperties();
        appProperties.getSecurity().getJwt().setSecret("test-secret-key-with-minimum-32-chars-length");
        appProperties.getSecurity().getJwt().setAccessTokenExpiration(Duration.ofMinutes(15));
        
        jwtService = new JwtService(appProperties);
        
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .passwordHash("hashed")
                .role(Role.CUSTOMER)
                .active(true)
                .build();
    }

    @Test
    void shouldGenerateValidAccessToken() {
        String token = jwtService.generateAccessToken(testUser);
        
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertEquals(testUser.getEmail(), jwtService.extractUsername(token));
    }

    @Test
    void shouldExtractUsernameFromToken() {
        String token = jwtService.generateAccessToken(testUser);
        
        String username = jwtService.extractUsername(token);
        
        assertEquals("test@example.com", username);
    }

    @Test
    void shouldValidateTokenWithMatchingUserDetails() {
        String token = jwtService.generateAccessToken(testUser);
        
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(testUser.getEmail());
        
        boolean isValid = jwtService.isTokenValid(token, userDetails);
        
        assertTrue(isValid);
    }

    @Test
    void shouldRejectTokenWithWrongEmail() {
        String token = jwtService.generateAccessToken(testUser);
        
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("wrong@example.com");
        
        boolean isValid = jwtService.isTokenValid(token, userDetails);
        
        assertFalse(isValid);
    }

    @Test
    void shouldDetectMalformedToken() {
        String malformedToken = "invalid.token.here";
        
        boolean isMalformed = jwtService.isMalformed(malformedToken);
        
        assertTrue(isMalformed);
    }

    @Test
    void shouldRejectExpiredToken() throws InterruptedException {
        appProperties.getSecurity().getJwt().setAccessTokenExpiration(Duration.ofMillis(100));
        jwtService = new JwtService(appProperties);
        
        String token = jwtService.generateAccessToken(testUser);
        Thread.sleep(150);
        
        boolean isExpired = jwtService.isTokenExpired(token);
        
        assertTrue(isExpired);
    }
}
