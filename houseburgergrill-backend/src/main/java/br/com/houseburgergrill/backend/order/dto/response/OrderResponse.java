package br.com.houseburgergrill.backend.order.dto.response;

import br.com.houseburgergrill.backend.order.model.DeliveryType;
import br.com.houseburgergrill.backend.order.model.OrderStatus;
import br.com.houseburgergrill.backend.order.model.PaymentMethod;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        OrderStatus status,
        PaymentMethod paymentMethod,
        DeliveryType deliveryType,
        String deliveryAddress,
        String notes,
        BigDecimal totalAmount,
        Instant createdAt,
        Instant updatedAt,
        CustomerSummaryResponse customer,
        List<OrderItemResponse> items
) {
}
