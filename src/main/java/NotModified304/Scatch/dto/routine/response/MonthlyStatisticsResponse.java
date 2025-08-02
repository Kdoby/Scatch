package NotModified304.Scatch.dto.routine.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyStatisticsResponse {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    // 루틴 종료 여부
    private Boolean isClosed;
    // 루틴을 실행한 날짜 목록
    private List<LocalDate> dates;
    private double monthlyStatistic;
}
