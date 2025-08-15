package NotModified304.Scatch.controller;

import NotModified304.Scatch.dto.todo.TodoCreateRequestDto;
import NotModified304.Scatch.dto.todo.TodoDateRequestDto;
import NotModified304.Scatch.dto.todo.TodoGroupedResponseDto;
import NotModified304.Scatch.dto.todo.TodoUpdateRequestDto;
import NotModified304.Scatch.service.GroupTodoService;
import NotModified304.Scatch.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class TodoApiController {

    private final TodoService todoService;
    private final GroupTodoService groupTodoService;


    // 특정 날짜에 todo 등록
    @PostMapping("/todos")
    public ResponseEntity<?> createTodo(@RequestBody TodoCreateRequestDto request) {
        todoService.saveTodo(request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "todo 생성 성공"
        ));
    }

    // todo 수정
    @PutMapping("/todos/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable("id") Long id, @RequestBody TodoUpdateRequestDto request) {
        todoService.updateTodo(id, request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "todo 수정 성공"
        ));
    }

    // todo 삭제
    @DeleteMapping("/todos/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable("id") Long id) {
        todoService.deleteTodo(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "todo 삭제 성공"
        ));
    }

    // 특정 날짜의 todo 목록 조회 (category + todos + lesson)
    @PostMapping("/todos/list")
    public ResponseEntity<?> getTodosGroupedByDateAndCategory(@RequestBody TodoDateRequestDto request) {
        List<TodoGroupedResponseDto> todos = groupTodoService.findDateList(request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "날짜/그룹별 todoList 조회 성공",
                "data", todos
        ));
    }
}