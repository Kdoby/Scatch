package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Routine;
import NotModified304.Scatch.domain.RoutineLog;
import NotModified304.Scatch.dto.routine.response.DailyStatisticsResponse;
import NotModified304.Scatch.dto.routine.response.MonthlyStatisticsResponse;
import NotModified304.Scatch.dto.routine.response.RoutineResponse;
import NotModified304.Scatch.dto.routine.response.WeeklyStatisticsResponse;
import NotModified304.Scatch.repository.interfaces.RepeatDaysRepository;
import NotModified304.Scatch.repository.interfaces.RoutineLogRepository;
import NotModified304.Scatch.repository.interfaces.RoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RoutineStatisticsService {

    private final RoutineRepository routineRepository;
    private final RepeatDaysRepository repeatDaysRepository;
    private final RoutineLogRepository routineLogRepository;

    // 일간 통계
    public DailyStatisticsResponse getDailyStatistics(String username, LocalDate targetDate) {

        // startDate <= targetDate <= endDate 인 루틴 목록 추출
        List<Routine> routines = routineRepository.findRoutinesOnDate(username, targetDate);
        List<RoutineResponse> result = new ArrayList<>();

        // targetDate 에 속하는 루틴 개수
        int size = 0;
        // targetDate 에 달성한 루틴 개수
        int completeCount = 0;
        
        for(Routine routine : routines) {
            // 루틴의 반복 요일 추출 (ex) 월, 수, 금)
            List<Integer> repeatDays = repeatDaysRepository.findRepeatDays(routine.getId());
            // Java 에서는 MON = 1 ~ SUN = 7, DB 에서는 SUN = 1, MON = 2 ~ SAT = 7
            int weekDay = targetDate.getDayOfWeek().getValue() % 7 + 1;

            // targetDate 요일을 반복 요일이 포함하고 있지 않으면 pass
            if(!repeatDays.contains(weekDay)) continue;

            size++;

            // 해당 날짜에 루틴 로그가 존재하는지 확인
            Optional<RoutineLog> logOpt = routineLogRepository.findLog(routine.getId(), targetDate);
            boolean isCompleted = logOpt.isPresent() && logOpt.get().getIsCompleted();

            // 기록이 존재하고, 달성한 루틴인 경우 count + 1
            if(isCompleted) completeCount++;

            result.add((RoutineResponse.builder()
                    .id(routine.getId())
                    .name(routine.getName())
                    .startDate(routine.getStartDate())
                    .endDate(routine.getEndDate())
                    .isCompleted(isCompleted)
                    .isClosed(routine.getIsClosed())
                    .build()));

        }

        double completionRate = size == 0 ? 0.0 : Math.round((double) completeCount / size * 100);

        return DailyStatisticsResponse.builder()
                .dailyStatistic(completionRate)
                .routines(result)
                .build();
    }

    // 주간 통계
    public List<WeeklyStatisticsResponse> getWeeklyStatisticsForAllRoutines(String username, int year, int month, int weekInMonth) {

        LocalDate [] weekRange = getWeekRange(year, month, weekInMonth);
        LocalDate firstDay = weekRange[0];
        LocalDate lastDay = weekRange[1];

        // 특정 주차에 속하는 루틴 목록, id 추출
        List<Routine> routines = routineRepository.findRoutinesInMonth(username, firstDay, lastDay);
        List<Long> routineIds = routines.stream().map(Routine::getId).toList();

        // 각 루틴 id에 해당하는 반복 요일 추출
        Map<Long, List<Integer>> repeatDaysMap = routines.stream()
                .collect(Collectors.toMap(Routine::getId, r -> repeatDaysRepository.findRepeatDays(r.getId())));

        // 루틴 id 목록 안에서 주어진 날짜 범위의 log 조회
        List<RoutineLog> logs = routineLogRepository.findLogsInRange(routineIds, firstDay, lastDay);
        // log 들을 (routineId -> (date -> RoutineLog)) 형태로 Map 에 정리
        Map<Long, Map<LocalDate, RoutineLog>> logMap = new HashMap<>();
        for(RoutineLog log : logs) {
            logMap.computeIfAbsent(log.getRoutineId(), k -> new HashMap<>()).put(log.getDate(), log);
        }

        List<WeeklyStatisticsResponse> result = new ArrayList<>();

        // 특정 주차에 속하는 루틴 목록 순회
        for(Routine routine : routines) {
            int totalDays = 0;
            int completedCount = 0;
            // 1 = 일요일, 2 = 월요일, .. , 7 = 토요일
            List<Integer> days = new ArrayList<>();

            // 특정 루틴의 반복 요일 : 최대 7일
            List<Integer> repeatDays = repeatDaysMap.get(routine.getId());

            // 7일(x주차)
            for(LocalDate date = firstDay; !date.isAfter(lastDay); date = date.plusDays(1)) {
                int weekDay = date.getDayOfWeek().getValue() % 7 + 1;

                // 범위 내에 존재하지 않는 루틴이거나, 범위 내에 존재하지만 반복 요일에 해당하지 않는 경우 pass
                if(date.isBefore(routine.getStartDate()) ||
                        date.isAfter(routine.getEndDate()) ||
                        !repeatDays.contains(weekDay)) {
                    continue;
                }

                // 루틴을 실행했어야 하는 요일 개수
                totalDays++;
                Map<LocalDate, RoutineLog> routineLogs = logMap.get(routine.getId());
                // 루틴 id에 대한 log 가 없는 경우에는 null,
                // log 가 있는 경우에는 현재 탐색 중인 date 에 대한 log 가 있는지 get
                RoutineLog log = routineLogs != null ? routineLogs.get(date) : null;
                boolean isCompleted = log != null && log.getIsCompleted();

                // 현재 날짜에 대한 log 가 존재하고, is_completed == true 이면 + 1
                if(isCompleted) {
                    completedCount++;
                    days.add(weekDay);
                }
            }

            double completionRate = totalDays == 0 ? 0.0 : Math.round((double) completedCount / totalDays * 100);

            result.add(WeeklyStatisticsResponse.builder()
                    .id(routine.getId())
                    .name(routine.getName())
                    .startDate(routine.getStartDate())
                    .endDate(routine.getEndDate())
                    .days(days)
                    .isClosed(routine.getIsClosed())
                    .weeklyStatistic(completionRate)
                    .build());
        }

        return result;
    }

    // 월간 통계
    public List<MonthlyStatisticsResponse> getMonthlyStatisticsForAllRoutines(String username, int year, int month) {

        // 20xx-xx-01 ~ 20xx-xx-31
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());

        // 특정 달에 속하는 루틴 목록, id 추출
        List<Routine> routines = routineRepository.findRoutinesInMonth(username, firstDay, lastDay);
        List<Long> routineIds = routines.stream().map(Routine::getId).toList();
        
        // 각 루틴 id에 해당하는 반복 요일 추출
        Map<Long, List<Integer>> repeatDaysMap = routines.stream()
                .collect(Collectors.toMap(Routine::getId, r -> repeatDaysRepository.findRepeatDays(r.getId())));

        // 루틴 id 목록 안에서 주어진 날짜 범위의 log 조회
        List<RoutineLog> logs = routineLogRepository.findLogsInRange(routineIds, firstDay, lastDay);
        // log 들을 (routineId -> (date -> RoutineLog)) 형태로 Map 에 정리
        Map<Long, Map<LocalDate, RoutineLog>> logMap = new HashMap<>();
        for(RoutineLog log : logs) {
            logMap.computeIfAbsent(log.getRoutineId(), k -> new HashMap<>()).put(log.getDate(), log);
        }

        List<MonthlyStatisticsResponse> result = new ArrayList<>();
        
        // 특정 달에 속하는 루틴 목록 순회
        for(Routine routine : routines) {
            int totalDays = 0;
            int completedCount = 0;
            List<LocalDate> dates = new ArrayList<>();

            // 특정 루틴의 반복 요일 : 최대 7일
            List<Integer> repeatDays = repeatDaysMap.get(routine.getId());

            // 1일~31일(or 30일, 28일)
            for(LocalDate date = firstDay; !date.isAfter(lastDay); date = date.plusDays(1)) {
                int weekDay = date.getDayOfWeek().getValue() % 7 + 1;

                // 범위 내에 존재하지 않는 루틴이거나, 범위 내에 존재하지만 반복 요일에 해당하지 않는 경우 pass
                if(date.isBefore(routine.getStartDate()) ||
                   date.isAfter(routine.getEndDate()) ||
                   !repeatDays.contains(weekDay)) {
                    continue;
                }

                // 루틴을 실행했어야 하는 요일 개수
                totalDays++;
                Map<LocalDate, RoutineLog> routineLogs = logMap.get(routine.getId());
                // 루틴 id에 대한 log 가 없는 경우에는 null,
                // log 가 있는 경우에는 현재 탐색 중인 date 에 대한 log 가 있는지 get
                RoutineLog log = routineLogs != null ? routineLogs.get(date) : null;
                boolean isCompleted = log != null && log.getIsCompleted();

                // 현재 날짜에 대한 log 가 존재하고, is_completed == true 이면 + 1
                if(isCompleted) {
                    completedCount++;
                    dates.add(log.getDate());
                }
            }

            double completionRate = totalDays == 0 ? 0.0 : Math.round((double) completedCount / totalDays * 100);

            result.add(MonthlyStatisticsResponse.builder()
                    .id(routine.getId())
                    .name(routine.getName())
                    .startDate(routine.getStartDate())
                    .endDate(routine.getEndDate())
                    .dates(dates)
                    .isClosed(routine.getIsClosed())
                    .monthlyStatistic(completionRate)
                    .build());
        }

        return result;
    }

    // '년/월/주차' 에 대한 날짜 계산 (7일)
    private LocalDate[] getWeekRange(int year, int month, int weekInMonth) {

        LocalDate firstDay = LocalDate.of(year, month, 1);
        // year - month - 01 이 속한 주의 월요일
        WeekFields wf = WeekFields.of(DayOfWeek.MONDAY, 1);
        LocalDate weekStart = firstDay.with(wf.weekOfMonth(), weekInMonth).with(wf.dayOfWeek(), 1);
        LocalDate weekEnd = weekStart.plusDays(6);
        // 7일짜리 날짜 추출 (weekStart, weekEnd)
        return new LocalDate[]{weekStart, weekEnd};
    }
}
