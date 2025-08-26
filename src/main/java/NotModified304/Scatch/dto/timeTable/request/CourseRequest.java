package NotModified304.Scatch.dto.timeTable.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRequest {
    private String title;
    private String instructor;
    private String color;
}
