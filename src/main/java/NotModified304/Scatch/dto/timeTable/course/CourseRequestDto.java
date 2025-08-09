package NotModified304.Scatch.dto.timeTable.course;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRequestDto {
    private String title;
    private String instructor;
    private String color;
}
