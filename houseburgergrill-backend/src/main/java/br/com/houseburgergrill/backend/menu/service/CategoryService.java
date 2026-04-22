package br.com.houseburgergrill.backend.menu.service;

import br.com.houseburgergrill.backend.common.exception.NotFoundException;
import br.com.houseburgergrill.backend.menu.model.Category;
import br.com.houseburgergrill.backend.menu.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Category findByIdOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoria nao encontrada"));
    }
}
