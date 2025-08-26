package NotModified304.Scatch.dto.todo.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {
    private String name;
    private String color;
    private Boolean isActive;
}
