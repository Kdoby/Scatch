package NotModified304.Scatch.dto.todo.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoUpdateRequest {
    private String title;
    private Boolean isDone;
}
