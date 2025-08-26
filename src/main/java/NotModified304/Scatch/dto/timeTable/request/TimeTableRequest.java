package NotModified304.Scatch.dto.timeTable.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeTableRequest {
    private String name;
    private Boolean isMain;
}
