package NotModified304.Scatch.dto.timeTable.response;

import NotModified304.Scatch.domain.timeTable.Course;
import NotModified304.Scatch.domain.todo.TimeTableDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


import java.util.stream.Collectors;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimeTableWithCourseResponse {
    private Long courseId;
    private String title;
    private String instructor;
    private String color;
    private List<TimeTableDetailResponse> details;

    public TimeTableWithCourseResponse(Course course, List<TimeTableDetail> details) {
        this.courseId = course.getId();
        this.title = course.getTitle();
        this.instructor = course.getInstructor();
        this.color = course.getColor();
        this.details = details.stream()
                .map(TimeTableDetailResponse::new)
                .collect(Collectors.toList());
    }
}
