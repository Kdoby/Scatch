package NotModified304.Scatch.dto.timeTable.tt;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeTableUpdateDto {
    private String name;
    private Boolean isMain;
}
