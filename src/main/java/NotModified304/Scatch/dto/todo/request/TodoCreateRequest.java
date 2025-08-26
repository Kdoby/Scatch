package NotModified304.Scatch.dto.todo.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoCreateRequest {
    private Long categoryId;
    private String title;
    private LocalDate todoDate;
}
