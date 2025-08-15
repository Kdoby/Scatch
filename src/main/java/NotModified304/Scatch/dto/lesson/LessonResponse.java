package NotModified304.Scatch.dto.lesson;

import NotModified304.Scatch.domain.Lesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LessonResponse {
    private Long id;
    private String content;
    private String contentWriter;

    // 격언이 존재하지 않으면 둘 다 빈 상태로 보냄
    public static LessonResponse from(Lesson lesson) {
        if(lesson == null) {
            return new LessonResponse(null, null, null);
        }
        return new LessonResponse(lesson.getId(), lesson.getContent(), lesson.getContentWriter());
    }
}
