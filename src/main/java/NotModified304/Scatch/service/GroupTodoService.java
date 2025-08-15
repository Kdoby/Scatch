package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Todo;
import NotModified304.Scatch.dto.todo.TodoDateRequestDto;
import NotModified304.Scatch.dto.todo.TodoGroupedResponseDto;
import NotModified304.Scatch.repository.interfaces.LessonRepository;
import NotModified304.Scatch.repository.interfaces.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class GroupTodoService {
    private final TodoRepository todoRepository;
    private final LessonRepository lessonRepository;

    public List<TodoGroupedResponseDto> findDateList(TodoDateRequestDto todoDto) {
        List<Todo> todos = todoRepository.findByDate(todoDto.getUserId(), todoDto.getTodoDate());

        Map<String, TodoGroupedResponseDto> groupedMap = new LinkedHashMap<>();

        // 특정 날짜의 todo 목록을 추출
        for (Todo todo : todos) {
            // todo 가 속한 category 분류의 id 값 가져옴
            Long categoryId = todo.getCategory().getId();

            // 그룹 키 = categoryId
            String key = String.valueOf(categoryId);

            // key 값이 존재하지 않으면 새로운 그룹화 배열을 생성
            groupedMap.computeIfAbsent(key, k -> new TodoGroupedResponseDto(categoryId,
                    todo.getCategory().getName(), todo.getCategory().getColor(), todo.getCategory().getIsActive()));

            // 해당하는 categoryName 그룹에 Todo 객체를 추가
            groupedMap.get(key).addTodo(todo);
        }
        return new ArrayList<>(groupedMap.values());
    }
}
