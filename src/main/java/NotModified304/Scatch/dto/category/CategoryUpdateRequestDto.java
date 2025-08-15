package NotModified304.Scatch.dto.category;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryUpdateRequestDto {
    private String name;
    private String color;
    private Boolean isActive;
}
