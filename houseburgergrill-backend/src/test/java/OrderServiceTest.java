package br.com.houseburgergrill.backend.order.service;

import br.com.houseburgergrill.backend.common.exception.BadRequestException;
import br.com.houseburgergrill.backend.common.exception.NotFoundException;
import br.com.houseburgergrill.backend.menu.model.Product;
import br.com.houseburgergrill.backend.menu.repository.ProductRepository;
import br.com.houseburgergrill.backend.order.dto.request.CreateOrderItemRequest;
import br.com.houseburgergrill.backend.order.dto.request.CreateOrderRequest;
import br.com.houseburgergrill.backend.order.dto.response.OrderResponse;
import br.com.houseburgergrill.backend.order.model.DeliveryType;
import br.com.houseburgergrill.backend.order.model.Order;
import br.com.houseburgergrill.backend.order.model.PaymentMethod;
import br.com.houseburgergrill.backend.order.repository.OrderRepository;
import br.com.houseburgergrill.backend.user.model.Role;
import br.com.houseburgergrill.backend.user.model.User;
import br.com.houseburgergrill.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    private User testCustomer;
    private Product testProduct;

    @BeforeEach
    void setup() {
        orderRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();

        testCustomer = User.builder()
                .fullName("Test Customer")
                .email("customer@test.com")
                .passwordHash("hashed")
                .role(Role.CUSTOMER)
                .active(true)
                .build();
        testCustomer = userRepository.save(testCustomer);

        testProduct = Product.builder()
                .name("Test Burger")
                .description("A test burger")
                .price(BigDecimal.valueOf(25.00))
                .available(true)
                .build();
        testProduct = productRepository.save(testProduct);
    }

    @Test
    void shouldCreateOrderWithValidData() {
        CreateOrderItemRequest item = new CreateOrderItemRequest(testProduct.getId(), 2);
        CreateOrderRequest request = new CreateOrderRequest(
                PaymentMethod.PIX,
                DeliveryType.RETIRADA,
                null,
                null,
                List.of(item)
        );

        OrderResponse response = orderService.createOrder(testCustomer.getId(), request);

        assertNotNull(response);
        assertEquals(BigDecimal.valueOf(50.00), response.totalAmount());
        assertEquals(1, response.items().size());
    }

    @Test
    void shouldRejectOrderWithNonexistentCustomer() {
        CreateOrderItemRequest item = new CreateOrderItemRequest(testProduct.getId(), 1);
        CreateOrderRequest request = new CreateOrderRequest(
                PaymentMethod.PIX,
                DeliveryType.RETIRADA,
                null,
                null,
                List.of(item)
        );

        assertThrows(NotFoundException.class, () -> orderService.createOrder(9999L, request));
    }

    @Test
    void shouldRejectOrderWithUnavailableProduct() {
        testProduct.setAvailable(false);
        productRepository.save(testProduct);

        CreateOrderItemRequest item = new CreateOrderItemRequest(testProduct.getId(), 1);
        CreateOrderRequest request = new CreateOrderRequest(
                PaymentMethod.PIX,
                DeliveryType.RETIRADA,
                null,
                null,
                List.of(item)
        );

        assertThrows(BadRequestException.class, () -> orderService.createOrder(testCustomer.getId(), request));
    }

    @Test
    void shouldRejectDeliveryWithoutAddress() {
        CreateOrderItemRequest item = new CreateOrderItemRequest(testProduct.getId(), 1);
        CreateOrderRequest request = new CreateOrderRequest(
                PaymentMethod.PIX,
                DeliveryType.ENTREGA,
                null,
                null,
                List.of(item)
        );

        assertThrows(BadRequestException.class, () -> orderService.createOrder(testCustomer.getId(), request));
    }

    @Test
    void shouldRejectDuplicateProductInOrder() {
        CreateOrderItemRequest item1 = new CreateOrderItemRequest(testProduct.getId(), 1);
        CreateOrderItemRequest item2 = new CreateOrderItemRequest(testProduct.getId(), 2);
        CreateOrderRequest request = new CreateOrderRequest(
                PaymentMethod.PIX,
                DeliveryType.RETIRADA,
                null,
                null,
                List.of(item1, item2)
        );

        assertThrows(BadRequestException.class, () -> orderService.createOrder(testCustomer.getId(), request));
    }

    @Test
    void shouldCalculateTotalAmountCorrectly() {
        Product product2 = Product.builder()
                .name("Test Drink")
                .description("A test drink")
                .price(BigDecimal.valueOf(10.00))
                .available(true)
                .build();
        product2 = productRepository.save(product2);

        CreateOrderItemRequest item1 = new CreateOrderItemRequest(testProduct.getId(), 2);
        CreateOrderItemRequest item2 = new CreateOrderItemRequest(product2.getId(), 3);
        CreateOrderRequest request = new CreateOrderRequest(
                PaymentMethod.PIX,
                DeliveryType.RETIRADA,
                null,
                null,
                List.of(item1, item2)
        );

        OrderResponse response = orderService.createOrder(testCustomer.getId(), request);

        BigDecimal expected = BigDecimal.valueOf(25.00).multiply(BigDecimal.valueOf(2))
                .add(BigDecimal.valueOf(10.00).multiply(BigDecimal.valueOf(3)));
        assertEquals(expected, response.totalAmount());
    }
}
