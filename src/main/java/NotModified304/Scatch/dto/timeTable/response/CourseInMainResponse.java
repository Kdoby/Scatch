package NotModified304.Scatch.dto.timeTable.response;

import NotModified304.Scatch.domain.timeTable.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CourseInMainResponse {
    private Long courseId;
    private String title;
    private String instructor;
    private String color;

    public static CourseInMainResponse from(Course c) {
        return new CourseInMainResponse(
                c.getId(),
                c.getTitle(),
                c.getInstructor(),
                c.getColor()
        );
    }
}
