package NotModified304.Scatch.dto.timeTable.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentUpdateRequest {
    private Long id;
    private String title;
    private String memo;
    private LocalDateTime deadline;
}
