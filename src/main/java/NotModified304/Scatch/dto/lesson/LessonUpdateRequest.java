package NotModified304.Scatch.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LessonUpdateRequest {
    private String content;
    private String contentWriter;
}
