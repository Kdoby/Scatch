package NotModified304.Scatch.dto.studyLog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class StudyLogUpdateRequest {
    private LocalDate logDate;
    private LocalDateTime start;
    private LocalDateTime end;
}
