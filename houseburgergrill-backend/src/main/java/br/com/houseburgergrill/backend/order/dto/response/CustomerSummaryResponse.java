package br.com.houseburgergrill.backend.order.dto.response;

public record CustomerSummaryResponse(
        Long id,
        String fullName,
        String email
) {
}
