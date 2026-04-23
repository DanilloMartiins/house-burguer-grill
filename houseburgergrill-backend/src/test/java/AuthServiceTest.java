package br.com.houseburgergrill.backend.auth.service;

import br.com.houseburgergrill.backend.auth.dto.AuthResponse;
import br.com.houseburgergrill.backend.auth.dto.LoginRequest;
import br.com.houseburgergrill.backend.auth.dto.RegisterRequest;
import br.com.houseburgergrill.backend.common.exception.ConflictException;
import br.com.houseburgergrill.backend.common.exception.UnauthorizedException;
import br.com.houseburgergrill.backend.security.service.JwtService;
import br.com.houseburgergrill.backend.user.model.Role;
import br.com.houseburgergrill.backend.user.model.User;
import br.com.houseburgergrill.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanup() {
        userRepository.deleteAll();
    }

    @Test
    void shouldRegisterNewUser() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "SecurePass@123");
        
        AuthResponse response = authService.register(request);
        
        assertNotNull(response.accessToken());
        assertNotNull(response.refreshToken());
        assertEquals("Bearer", response.tokenType());
        
        Optional<User> savedUser = userRepository.findByEmailIgnoreCase("john@example.com");
        assertTrue(savedUser.isPresent());
        assertEquals(Role.CUSTOMER, savedUser.get().getRole());
    }

    @Test
    void shouldRejectDuplicateEmail() {
        RegisterRequest request1 = new RegisterRequest("User 1", "duplicate@example.com", "Pass@123456");
        authService.register(request1);
        
        RegisterRequest request2 = new RegisterRequest("User 2", "duplicate@example.com", "Pass@654321");
        
        assertThrows(ConflictException.class, () -> authService.register(request2));
    }

    @Test
    void shouldLoginWithValidCredentials() {
        RegisterRequest registerRequest = new RegisterRequest("Test User", "test@example.com", "ValidPass@123");
        authService.register(registerRequest);
        
        LoginRequest loginRequest = new LoginRequest("test@example.com", "ValidPass@123");
        AuthResponse response = authService.login(loginRequest);
        
        assertNotNull(response.accessToken());
        assertNotNull(response.refreshToken());
    }

    @Test
    void shouldRejectLoginWithWrongPassword() {
        RegisterRequest registerRequest = new RegisterRequest("Test User", "test@example.com", "CorrectPass@123");
        authService.register(registerRequest);
        
        LoginRequest loginRequest = new LoginRequest("test@example.com", "WrongPassword@123");
        
        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }

    @Test
    void shouldRejectLoginWithNonexistentEmail() {
        LoginRequest loginRequest = new LoginRequest("nonexistent@example.com", "SomePass@123");
        
        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }
}
