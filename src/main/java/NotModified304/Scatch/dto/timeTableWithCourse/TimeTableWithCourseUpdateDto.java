package NotModified304.Scatch.dto.timeTableWithCourse;

import NotModified304.Scatch.dto.course.CourseUpdateDto;
import NotModified304.Scatch.dto.timeTableDetail.TimeTableDetailUpdateDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TimeTableWithCourseUpdateDto {
    private TimeTableDetailUpdateDto tableDetailDto;
    private CourseUpdateDto courseDto;
}
