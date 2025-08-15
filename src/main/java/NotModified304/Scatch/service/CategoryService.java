/*
package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Category;
import NotModified304.Scatch.dto.category.CategoryRequestDto;
import NotModified304.Scatch.dto.category.CategoryResponseDto;
import NotModified304.Scatch.dto.category.CategoryUpdateRequestDto;
import NotModified304.Scatch.repository.interfaces.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    // 활성화된 카테고리 중에서 중복되는 이름이 있는지 체크
    public void validateDuplicateCategory(CategoryRequestDto categoryDto) {
        categoryRepository.findByCategoryName(categoryDto.getUserId(), categoryDto.getName())
                .ifPresent(c -> {
                    throw new IllegalStateException("이미 존재하는 카테고리입니다.");
                });
    }

    // 중복 체크 후 저장
    public Long saveCategory(CategoryRequestDto categoryDto) {
        validateDuplicateCategory(categoryDto);
        Category category = categoryRepository.save(categoryDto.toEntity());
        return category.getId();
    }

    public void updateCategory(Long id, CategoryUpdateRequestDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
        if(dto.getName() != null) category.setName(dto.getName());
        if(dto.getColor() != null) category.setColor(dto.getColor());
        if(dto.getIsActive() != null) category.setIsActive(dto.getIsActive());
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
        categoryRepository.delete(category);
    }

    // 카테고리 목록 찾기 - 활성화 or 비활성화
    public List<CategoryResponseDto> findCategories(String userId, Boolean isActive) {
       return categoryRepository.findByUserIdAndIsActive(userId, isActive)
               .stream()
               .map(CategoryResponseDto::new)
               .collect(Collectors.toList());
    }
}
*/
