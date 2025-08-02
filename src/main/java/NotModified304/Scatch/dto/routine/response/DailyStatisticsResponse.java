package NotModified304.Scatch.dto.routine.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DailyStatisticsResponse {
    private double dailyStatistic;
    private List<RoutineResponse> routines;
}
