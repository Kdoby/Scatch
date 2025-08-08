package NotModified304.Scatch.dto.timeTable.course;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseUpdateDto {
    private Long courseId;
    private String title;
    private String instructor;
    private String color;
}
