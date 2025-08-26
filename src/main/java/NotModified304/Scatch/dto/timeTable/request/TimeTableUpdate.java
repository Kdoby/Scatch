package NotModified304.Scatch.dto.timeTable.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeTableUpdate {
    private String name;
    private Boolean isMain;
}
