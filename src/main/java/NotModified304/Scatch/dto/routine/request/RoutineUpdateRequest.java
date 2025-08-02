package NotModified304.Scatch.dto.routine.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoutineUpdateRequest {
    private Long routineId;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
}
