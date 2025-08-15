package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Category;
import NotModified304.Scatch.domain.Todo;
import NotModified304.Scatch.dto.todo.*;
import NotModified304.Scatch.repository.interfaces.CategoryRepository;
import NotModified304.Scatch.repository.interfaces.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    private final CategoryRepository categoryRepository;
    // todo 등록
    public Long saveTodo(TodoCreateRequestDto todoDto) {
        // 존재하지 않거나, 비활성화된 카테고리에 대해서는 등록할 수 없음
        Category category = categoryRepository.findById(todoDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        // dto -> entity
        Todo todo = Todo.builder()
                .userId(todoDto.getUserId())
                .title(todoDto.getTitle())
                .category(category)
                .todoDate(todoDto.getTodoDate())
                .build();

        todoRepository.save(todo);
        return todo.getId();
    }
    
    // todo 수정
    public void updateTodo(Long id, TodoUpdateRequestDto dto) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 todo 입니다."));
        if(dto.getTitle() != null) todo.setTitle(dto.getTitle());
        if(dto.getIsDone() != null) todo.setIsDone(dto.getIsDone());
    }

    // todo 삭제
    public void deleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 todo 입니다."));
        todoRepository.delete(todo);
    }
}
