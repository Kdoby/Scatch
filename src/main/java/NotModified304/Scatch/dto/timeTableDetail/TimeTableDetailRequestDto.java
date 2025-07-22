package NotModified304.Scatch.dto.timeTableDetail;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeTableDetailRequestDto {
    private Long timeTableId;
    private Long courseId;
    private int weekday;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;
}
