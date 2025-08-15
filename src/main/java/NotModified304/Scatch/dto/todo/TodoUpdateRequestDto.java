package NotModified304.Scatch.dto.todo;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoUpdateRequestDto {
    private String title;
    private Boolean isDone;
}
