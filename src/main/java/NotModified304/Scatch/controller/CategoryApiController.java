/*
package NotModified304.Scatch.controller;

import NotModified304.Scatch.dto.category.CategoryRequestDto;
import NotModified304.Scatch.dto.category.CategoryResponseDto;
import NotModified304.Scatch.dto.category.CategoryUpdateRequestDto;
import NotModified304.Scatch.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class CategoryApiController {

    private final CategoryService categoryService;

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequestDto request) {
        Long id = categoryService.saveCategory(request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "카테고리 생성 성공"
        ));
    }

    @GetMapping("/categories/{userId}")
    public List<CategoryResponseDto> getAllCategories(@PathVariable("userId") String userId, @RequestParam("is_active") Boolean isActive) {
        return categoryService.findCategories(userId, isActive);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateActivation(@PathVariable("id") Long id, @RequestBody CategoryUpdateRequestDto request) {
        categoryService.updateCategory(id, request);
        return ResponseEntity.ok("카테고리 수정 성공");
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("카테고리 삭제 성공");
    }
}
*/
