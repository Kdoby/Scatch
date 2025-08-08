package NotModified304.Scatch.dto.timeTable.ttc;

import NotModified304.Scatch.dto.timeTable.course.CourseUpdateDto;
import NotModified304.Scatch.dto.timeTable.ttd.TimeTableDetailUpdateDto;
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
