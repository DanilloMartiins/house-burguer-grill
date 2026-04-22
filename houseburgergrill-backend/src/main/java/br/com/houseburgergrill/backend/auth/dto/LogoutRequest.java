package br.com.houseburgergrill.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LogoutRequest(
        @NotBlank(message = "Refresh token e obrigatorio")
        String refreshToken
) {
}
