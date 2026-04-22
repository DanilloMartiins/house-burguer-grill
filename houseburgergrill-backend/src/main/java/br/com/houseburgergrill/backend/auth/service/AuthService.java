package br.com.houseburgergrill.backend.auth.service;

import br.com.houseburgergrill.backend.auth.dto.AuthResponse;
import br.com.houseburgergrill.backend.auth.dto.LoginRequest;
import br.com.houseburgergrill.backend.auth.dto.LogoutRequest;
import br.com.houseburgergrill.backend.auth.dto.RefreshTokenRequest;
import br.com.houseburgergrill.backend.auth.dto.RegisterRequest;
import br.com.houseburgergrill.backend.auth.model.RefreshToken;
import br.com.houseburgergrill.backend.common.exception.ConflictException;
import br.com.houseburgergrill.backend.common.exception.UnauthorizedException;
import br.com.houseburgergrill.backend.security.service.JwtService;
import br.com.houseburgergrill.backend.user.model.Role;
import br.com.houseburgergrill.backend.user.model.User;
import br.com.houseburgergrill.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ConflictException("E-mail ja cadastrado");
        }

        User user = User.builder()
                .fullName(request.fullName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.CUSTOMER)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        return issueTokens(savedUser);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
            );
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("E-mail ou senha invalidos");
        } catch (AuthenticationException ex) {
            throw new UnauthorizedException("Falha na autenticacao");
        }

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("E-mail ou senha invalidos"));

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        String rawToken = request.refreshToken().trim();
        RefreshToken currentToken = refreshTokenService.validateActiveToken(rawToken);
        User user = currentToken.getUser();

        // Rotaciona o refresh token para reduzir janela de reutilizacao indevida.
        refreshTokenService.revoke(currentToken);

        return issueTokens(user);
    }

    @Transactional
    public void logout(LogoutRequest request) {
        refreshTokenService.revokeByRawToken(request.refreshToken().trim());
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        RefreshTokenService.CreatedRefreshToken refreshToken = refreshTokenService.create(user);

        return new AuthResponse(
                accessToken,
                refreshToken.rawToken(),
                "Bearer",
                jwtService.accessTokenExpiresInSeconds()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
