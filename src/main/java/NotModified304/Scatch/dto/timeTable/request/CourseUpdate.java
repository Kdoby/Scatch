package NotModified304.Scatch.dto.timeTable.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseUpdate {
    private Long courseId;
    private String title;
    private String instructor;
    private String color;
}
