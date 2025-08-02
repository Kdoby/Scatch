package NotModified304.Scatch.dto.routine.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogUpdateRequest {
    private Long routineId;
    private LocalDate date;
    private Boolean isCompleted;
}
