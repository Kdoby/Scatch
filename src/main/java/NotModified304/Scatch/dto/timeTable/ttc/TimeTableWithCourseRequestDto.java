package NotModified304.Scatch.dto.timeTable.ttc;

import NotModified304.Scatch.dto.timeTable.course.CourseRequestDto;
import NotModified304.Scatch.dto.timeTable.ttd.TimeTableDetailRequestDto;
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
