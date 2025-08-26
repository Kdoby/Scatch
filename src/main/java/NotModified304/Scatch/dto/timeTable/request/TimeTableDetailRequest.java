package NotModified304.Scatch.dto.timeTable.request;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeTableDetailRequest {
    private Long timeTableId;
    private Long courseId;
    private int weekday;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;
}
