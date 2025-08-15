package NotModified304.Scatch.dto.studyLog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class StudyLogCreateRequest {
    private String userId;
    private Long todoId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    // 수동 등록 여부 (true = 수동, false = 타이머 측정)
    private Boolean isManual;
}
