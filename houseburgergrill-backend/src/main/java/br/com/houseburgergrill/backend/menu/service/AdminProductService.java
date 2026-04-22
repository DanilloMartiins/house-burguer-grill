package br.com.houseburgergrill.backend.menu.service;

import br.com.houseburgergrill.backend.common.exception.NotFoundException;
import br.com.houseburgergrill.backend.menu.dto.admin.AdminProductResponse;
import br.com.houseburgergrill.backend.menu.dto.admin.CategorySummaryResponse;
import br.com.houseburgergrill.backend.menu.dto.admin.ProductUpsertRequest;
import br.com.houseburgergrill.backend.menu.dto.common.PagedResponse;
import br.com.houseburgergrill.backend.menu.model.Product;
import br.com.houseburgergrill.backend.menu.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    @Transactional(readOnly = true)
    public PagedResponse<AdminProductResponse> list(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AdminProductResponse> productPage = productRepository.findAll(pageable).map(this::toAdminResponse);
        return PagedResponse.from(productPage);
    }

    @Transactional
    public AdminProductResponse create(ProductUpsertRequest request) {
        Product product = Product.builder()
                .name(request.name().trim())
                .description(request.description().trim())
                .price(request.price())
                .imageUrl(request.imageUrl().trim())
                .available(request.available())
                .category(categoryService.findByIdOrThrow(request.categoryId()))
                .build();

        return toAdminResponse(productRepository.save(product));
    }

    @Transactional
    public AdminProductResponse update(Long id, ProductUpsertRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto nao encontrado"));

        product.setName(request.name().trim());
        product.setDescription(request.description().trim());
        product.setPrice(request.price());
        product.setImageUrl(request.imageUrl().trim());
        product.setAvailable(request.available());
        product.setCategory(categoryService.findByIdOrThrow(request.categoryId()));

        return toAdminResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new NotFoundException("Produto nao encontrado");
        }
        productRepository.deleteById(id);
    }

    private AdminProductResponse toAdminResponse(Product product) {
        return new AdminProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getAvailable(),
                new CategorySummaryResponse(product.getCategory().getId(), product.getCategory().getName()),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
