package NotModified304.Scatch.service.todo;

import NotModified304.Scatch.domain.todo.Category;
import NotModified304.Scatch.domain.todo.Todo;
import NotModified304.Scatch.dto.todo.request.CategoryRequest;
import NotModified304.Scatch.dto.todo.request.TodoUpdateRequest;
import NotModified304.Scatch.dto.todo.response.CategoryResponse;
import NotModified304.Scatch.dto.todo.request.CategoryUpdateRequest;
import NotModified304.Scatch.dto.todo.request.TodoCreateRequest;
import NotModified304.Scatch.repository.interfaces.todo.CategoryRepository;
import NotModified304.Scatch.repository.interfaces.todo.TodoRepository;
import NotModified304.Scatch.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final CategoryRepository categoryRepository;

    public Category findCategory(Long id) {

        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리 입니다."));
    }

    public Todo findTodo(Long id) {

        return todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 todo 입니다."));
    }

    // 중복 체크 후 저장
    public Long saveCategory(String username, CategoryRequest req) {

        validateDuplicateCategory(username, req);

        Category category = Category.builder()
                .username(username)
                .name(req.getName())
                .color(req.getColor())
                .isActive(req.getIsActive())
                .build();

        categoryRepository.save(category);

        return category.getId();
    }

    public void updateCategory(String username, Long id, CategoryUpdateRequest req) {

        Category category = findCategory(id);

        SecurityUtil.validateOwner(category.getUsername(), username);

        if(req.getName() != null) category.setName(req.getName());
        if(req.getColor() != null) category.setColor(req.getColor());
        if(req.getIsActive() != null) category.setIsActive(req.getIsActive());
    }

    public void deleteCategory(String username, Long id) {

        Category category = findCategory(id);

        SecurityUtil.validateOwner(category.getUsername(), username);

        categoryRepository.delete(category);
    }

    // 카테고리 목록 찾기 - 활성화 or 비활성화
    public List<CategoryResponse> findCategories(String username, Boolean isActive) {

        return categoryRepository.findByUsernameAndIsActive(username, isActive)
                .stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList());
    }

    // 활성화된 카테고리 중에서 중복되는 이름이 있는지 체크
    public void validateDuplicateCategory(String username, CategoryRequest req) {

        categoryRepository.findByUsernameAndNameAndIsActiveTrue(username, req.getName())
                .ifPresent(c -> {
                    throw new IllegalStateException("이미 존재하는 카테고리입니다.");
                });
    }

    // todo 등록
    public Long saveTodo(String username, TodoCreateRequest req) {

        // 존재하지 않거나, 비활성화된 카테고리에 대해서는 등록할 수 없음
        Category category = findCategory(req.getCategoryId());

        SecurityUtil.validateOwner(category.getUsername(), username);

        // dto -> entity
        Todo todo = Todo.builder()
                .username(username)
                .title(req.getTitle())
                .category(category)
                .todoDate(req.getTodoDate())
                .build();

        todoRepository.save(todo);
        return todo.getId();
    }
    
    // todo 수정
    public void updateTodo(String username, Long id, TodoUpdateRequest req) {

        Todo todo = findTodo(id);

        SecurityUtil.validateOwner(todo.getUsername(), username);

        if(req.getTitle() != null) todo.setTitle(req.getTitle());
        if(req.getIsDone() != null) todo.setIsDone(req.getIsDone());
    }

    // todo 삭제
    public void deleteTodo(String username, Long id) {

        Todo todo = findTodo(id);

        SecurityUtil.validateOwner(todo.getUsername(), username);

        todoRepository.delete(todo);
    }
}
