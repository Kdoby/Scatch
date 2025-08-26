package NotModified304.Scatch.dto.todo.response;

import NotModified304.Scatch.domain.todo.Todo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TodoGroupedResponse {
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private Boolean categoryIsActive;
    private List<TodoResponse> todos = new ArrayList<>();

    public TodoGroupedResponse(Long categoryId, String categoryName, String categoryColor, Boolean categoryIsActive) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryColor = categoryColor;
        this.categoryIsActive = categoryIsActive;
        this.todos = new ArrayList<>(); // 초기화
    }

    public void addTodo(Todo todo) {
        this.todos.add(new TodoResponse(todo));
    }
}
