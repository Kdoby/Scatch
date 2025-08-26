package NotModified304.Scatch.dto.timeTable.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TimeTableWithCourseUpdate {
    private TimeTableDetailUpdate tableDetailDto;
    private CourseUpdate courseDto;
}
