package NotModified304.Scatch.dto.category;

import NotModified304.Scatch.domain.Category;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequestDto {
    private String name;
    private String color;
    private Boolean isActive;
}
