package NotModified304.Scatch.dto.timeTable.ttd;


import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeTableDetailUpdateDto {
    private Long timeTableDetailId;
    private Integer weekday;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;
}
