package br.com.houseburgergrill.backend.menu.dto.publicview;

import java.math.BigDecimal;

public record PublicMenuProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl
) {
}
