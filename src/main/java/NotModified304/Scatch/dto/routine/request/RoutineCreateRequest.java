package NotModified304.Scatch.dto.routine.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoutineCreateRequest {
    private String userId;
    private String name;
    private List<Integer> repeatDays;
    private LocalDate startDate;
    private LocalDate endDate;
}
