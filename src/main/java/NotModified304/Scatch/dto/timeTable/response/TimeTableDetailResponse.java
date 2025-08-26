package NotModified304.Scatch.dto.timeTable.response;

import NotModified304.Scatch.domain.todo.TimeTableDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimeTableDetailResponse {
    private Long id;
    private int weekday;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;

    public TimeTableDetailResponse(TimeTableDetail ttd) {
        this.id = ttd.getId();
        this.weekday = ttd.getWeekday();
        this.location = ttd.getLocation();
        this.startTime = ttd.getStartTime();
        this.endTime = ttd.getEndTime();
    }
}
