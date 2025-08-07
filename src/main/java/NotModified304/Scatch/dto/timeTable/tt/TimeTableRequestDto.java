package NotModified304.Scatch.dto.timeTable.tt;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeTableRequestDto {
    private String userId;
    private String name;
    private Boolean isMain;
}
