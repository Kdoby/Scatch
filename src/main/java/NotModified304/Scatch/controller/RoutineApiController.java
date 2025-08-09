package NotModified304.Scatch.controller;

import NotModified304.Scatch.dto.routine.request.LogUpdateRequest;
import NotModified304.Scatch.dto.routine.request.RoutineCreateRequest;
import NotModified304.Scatch.dto.routine.request.RoutineUpdateRequest;
import NotModified304.Scatch.dto.routine.response.DailyStatisticsResponse;
import NotModified304.Scatch.dto.routine.response.MonthlyStatisticsResponse;
import NotModified304.Scatch.dto.routine.response.WeeklyStatisticsResponse;
import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.RepeatDaysService;
import NotModified304.Scatch.service.RoutineLogService;
import NotModified304.Scatch.service.RoutineService;
import NotModified304.Scatch.service.RoutineStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RoutineApiController {
    private final RoutineService routineService;
    private final RepeatDaysService repeatDaysService;
    private final RoutineLogService routineLogService;
    private final RoutineStatisticsService routineStatisticsService;

    // 새로운 routine 을 등록
    @PostMapping("/routine")
    public ResponseEntity<?> createRoutine(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @RequestBody RoutineCreateRequest request) {

        Long routineId = routineService.registerRoutine(userDetails.getUsername(), request);
        repeatDaysService.registerRepeatDays(userDetails.getUsername(), routineId, request.getRepeatDays());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "루틴 등록 성공",
                "data", routineId
                )
        );
    }

    // 하루 루틴 목록 + 일간 통계
    @GetMapping("/routine/daily/{date}")
    public DailyStatisticsResponse getDailyStatistics(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                      @PathVariable("date") LocalDate targetDate) {

        return routineStatisticsService.getDailyStatistics(userDetails.getUsername(), targetDate);
    }

    // 루틴 목록 + 루틴별 주간 통계
    @GetMapping("/routine/weekly/{year}/{month}/{weekInMonth}")
    public List<WeeklyStatisticsResponse> getWeeklyStatistics(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                              @PathVariable("year") int year,
                                                              @PathVariable("month") int month,
                                                              @PathVariable("weekInMonth") int weekInMonth) {

        return routineStatisticsService.getWeeklyStatisticsForAllRoutines(userDetails.getUsername(), year, month, weekInMonth);
    }

    // 루틴 목록 + 루틴별 월간 통계
    @GetMapping("/routine/monthly/{year}/{month}")
    public List<MonthlyStatisticsResponse> getMonthlyStatistics(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                @PathVariable("year") int year,
                                                                @PathVariable("month") int month) {

        return routineStatisticsService.getMonthlyStatisticsForAllRoutines(userDetails.getUsername(), year, month);
    }

    // 루틴 수정
    @PutMapping("/routine")
    public ResponseEntity<?> updateRoutine(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @RequestBody RoutineUpdateRequest request) {

        routineService.updateRoutine(userDetails.getUsername(), request);
        routineLogService.updateRoutineLog(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "루틴 수정 성공"
        ));
    }

    // 루틴 삭제
    @DeleteMapping("/routine/{routineId}")
    public ResponseEntity<?> deleteRoutine(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @PathVariable("routineId") Long id) {

        routineLogService.removeRoutineLog(userDetails.getUsername(), id);
        repeatDaysService.removeRepeatDays(userDetails.getUsername(), id);
        routineService.removeRoutine(userDetails.getUsername(), id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "루틴 삭제 성공"
        ));
    }

    // 루틴 종료
    @PutMapping("/routine/close/{routineId}")
    public ResponseEntity<?> closeRoutine(@AuthenticationPrincipal CustomUserDetails userDetails,
                                          @PathVariable("routineId") Long id) {

        routineService.updateIsClosed(userDetails.getUsername(), id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "루틴 종료 성공"
        ));
    }

    // routine 에 대한 log 를 등록하거나, isCompleted 를 업데이트함
    @PostMapping("/routine/log")
    public ResponseEntity<?> updateLog(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @RequestBody LogUpdateRequest request) {

        routineLogService.registerRoutineLog(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "루틴 기록 등록 및 수정 성공"
                )
        );
    }
}
