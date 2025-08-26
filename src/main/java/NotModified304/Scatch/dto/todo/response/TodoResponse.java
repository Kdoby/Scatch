package NotModified304.Scatch.dto.todo.response;

import NotModified304.Scatch.domain.todo.Todo;
import NotModified304.Scatch.util.DurationUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TodoResponse {
    private Long id;
    private String title;
    private Boolean isDone;
    private LocalDate todoDate;

    private Integer totalHours;
    private Integer totalMinutes;
    private Integer totalSeconds;

    public TodoResponse(Todo todo) {
        this.id = todo.getId();
        this.title = todo.getTitle();
        this.isDone = todo.getIsDone();
        this.todoDate = todo.getTodoDate();

        int seconds = todo.getTotalDuration();
        this.totalHours = DurationUtils.getHours(seconds);
        this.totalMinutes = DurationUtils.getMinutes(seconds);
        this.totalSeconds = DurationUtils.getSeconds(seconds);
    }
}
