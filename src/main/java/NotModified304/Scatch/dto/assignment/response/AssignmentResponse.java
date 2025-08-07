package NotModified304.Scatch.dto.assignment.response;

import NotModified304.Scatch.domain.Assignment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponse {
    private Long id;
    private String courseTitle;
    private String title;
    private String color;
    private LocalDateTime deadline;

    public static AssignmentResponse from(Assignment a, String courseTitle) {
        return new AssignmentResponse(
                a.getId(),
                courseTitle,
                a.getTitle(),
                a.getColor(),
                a.getDeadline()
        );
    }
}
