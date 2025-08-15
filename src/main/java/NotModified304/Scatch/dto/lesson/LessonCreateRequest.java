package NotModified304.Scatch.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonCreateRequest {
    private String userId;
    private String content;
    private String contentWriter;
    private LocalDate lessonDate;
}
