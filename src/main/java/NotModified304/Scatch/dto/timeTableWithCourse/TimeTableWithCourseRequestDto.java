package NotModified304.Scatch.dto.timeTableWithCourse;

import NotModified304.Scatch.dto.course.CourseRequestDto;
import NotModified304.Scatch.dto.timeTableDetail.TimeTableDetailRequestDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TimeTableWithCourseRequestDto {
    private TimeTableDetailRequestDto tableDetailDto;
    private CourseRequestDto courseDto;
}
