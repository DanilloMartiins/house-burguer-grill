package br.com.houseburgergrill.backend.order.dto.request;

import br.com.houseburgergrill.backend.order.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull(message = "Status e obrigatorio")
        OrderStatus status
) {
}
