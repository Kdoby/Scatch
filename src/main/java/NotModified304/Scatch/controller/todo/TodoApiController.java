package NotModified304.Scatch.controller.todo;

import NotModified304.Scatch.dto.todo.request.CategoryRequest;
import NotModified304.Scatch.dto.todo.response.CategoryResponse;
import NotModified304.Scatch.dto.todo.request.CategoryUpdateRequest;
import NotModified304.Scatch.dto.todo.request.TodoCreateRequest;
import NotModified304.Scatch.dto.todo.response.TodoGroupedResponse;
import NotModified304.Scatch.dto.todo.request.TodoUpdateRequest;
import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.todo.GroupTodoService;
import NotModified304.Scatch.service.todo.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class TodoApiController {

    private final TodoService todoService;
    private final GroupTodoService groupTodoService;

    @PostMapping("/category")
    public ResponseEntity<?> createCategory(@AuthenticationPrincipal CustomUserDetails userDetails,
                                            @RequestBody CategoryRequest request) {

        Long id = todoService.saveCategory(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "카테고리 생성 성공"
        ));
    }

    // 카테고리 수정
    @PutMapping("/category/{id}")
    public ResponseEntity<?> updateActivation(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @PathVariable("id") Long id,
                                              @RequestBody CategoryUpdateRequest request) {

        todoService.updateCategory(userDetails.getUsername(), id, request);

        return ResponseEntity.ok("카테고리 수정 성공");
    }

    // 카테고리 삭제
    @DeleteMapping("/category/{id}")
    public ResponseEntity<?> deleteCategory(@AuthenticationPrincipal CustomUserDetails userDetails,
                                            @PathVariable("id") Long id) {

        todoService.deleteCategory(userDetails.getUsername(), id);

        return ResponseEntity.ok("카테고리 삭제 성공");
    }

    @GetMapping("/category/list")
    public List<CategoryResponse> getAllCategories(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                   @RequestParam("is_active") Boolean isActive) {

        return todoService.findCategories(userDetails.getUsername(), isActive);
    }

    // 특정 날짜에 todo 등록
    @PostMapping("/todo")
    public ResponseEntity<?> createTodo(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @RequestBody TodoCreateRequest request) {

        todoService.saveTodo(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "todo 생성 성공"
        ));
    }

    // todo 수정
    @PutMapping("/todo/{id}")
    public ResponseEntity<?> updateTodo(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @PathVariable("id") Long id,
                                        @RequestBody TodoUpdateRequest request) {

        todoService.updateTodo(userDetails.getUsername(), id, request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "todo 수정 성공"
        ));
    }

    // todo 삭제
    @DeleteMapping("/todo/{id}")
    public ResponseEntity<?> deleteTodo(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @PathVariable("id") Long id) {

        todoService.deleteTodo(userDetails.getUsername(), id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "todo 삭제 성공"
        ));
    }

    // 특정 날짜의 todo 목록 조회 (category + todos + lesson)
    @GetMapping("/todo/list/{date}")
    public ResponseEntity<?> getTodosGroupedByDateAndCategory(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                              @PathVariable("date") LocalDate date) {

        List<TodoGroupedResponse> todos = groupTodoService.findDateList(userDetails.getUsername(), date);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "날짜/그룹별 todoList 조회 성공",
                "data", todos
        ));
    }
}