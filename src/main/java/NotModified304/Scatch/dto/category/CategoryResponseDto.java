package NotModified304.Scatch.dto.category;

import NotModified304.Scatch.domain.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDto {
    private Long id;
    private String name;
    private String color;
    private Boolean isActive;

    // entity 정보와 맵핑해줌 (entity -> dto 변환 과정)
    public CategoryResponseDto(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.color = category.getColor();
        this.isActive = category.getIsActive();
    }
}
