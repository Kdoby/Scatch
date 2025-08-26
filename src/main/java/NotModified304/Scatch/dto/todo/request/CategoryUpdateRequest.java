package NotModified304.Scatch.dto.todo.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryUpdateRequest {
    private String name;
    private String color;
    private Boolean isActive;
}
