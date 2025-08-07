package NotModified304.Scatch.dto.assignment.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentCreateRequest {
    private Long courseId;
    private String title;
    private LocalDateTime deadline;
}
