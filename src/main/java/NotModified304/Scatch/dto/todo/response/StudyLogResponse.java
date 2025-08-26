package NotModified304.Scatch.dto.todo.response;

import NotModified304.Scatch.domain.todo.StudyLog;
import NotModified304.Scatch.util.DurationUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyLogResponse {
    private Long id;
    private String todoTitle;
    private String categoryName;
    private String categoryColor;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer hours;
    private Integer minutes;
    private Integer seconds;
    private Boolean isManual;

    public static StudyLogResponse from(StudyLog s) {
        return new StudyLogResponse(
                s.getId(),
                s.getTodoTitle(),
                s.getCategoryName(),
                s.getCategoryColor(),
                s.getStartTime(),
                s.getEndTime(),
                DurationUtils.getHours(s.getDuration()),
                DurationUtils.getMinutes(s.getDuration()),
                DurationUtils.getSeconds(s.getDuration()),
                s.getIsManual()
        );
    }
}

