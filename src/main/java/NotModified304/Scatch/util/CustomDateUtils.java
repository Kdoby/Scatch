package NotModified304.Scatch.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class CustomDateUtils {

    private static final LocalTime CUSTOM_DAY_START_TIME = LocalTime.of(6, 0);

    // 시작 시간이 오전 6시 이전이면 전날이고, 6시 이후이면 그날
    public static LocalDate getCustomLogDate(LocalDateTime dateTime) {
        return dateTime.toLocalTime().isBefore(CUSTOM_DAY_START_TIME)
                ? dateTime.toLocalDate().minusDays(1)
                : dateTime.toLocalDate();
    }

    // 주어진 시간이 속하는 커스텀 하루의 시작 시각 (06:00)
    public static LocalDateTime getCustomDayStart(LocalDateTime dateTime) {
        return getCustomLogDate(dateTime).atTime(CUSTOM_DAY_START_TIME);
    }

    // 주어진 시간이 속하는 커스텀 하루의 끝 시각 (다음날 05:59:59)
    public static LocalDateTime getCustomDayEnd(LocalDateTime dateTime) {
        return getCustomDayStart(dateTime).plusDays(1).minusSeconds(1);
    }
    
    // 타이머 측정이 가능한 todo인지 검사
    // todoDate 가 지금의 customLogDate 와 같아야 함.
    public static boolean isTodayForTimer(LocalDate todoDate, LocalDateTime now) {
        return todoDate.equals(getCustomLogDate(now));
    }

    // (오전 06:00 ~ 다음날 05:59) 범위에 속하는지 체크
    public static boolean isWithinCustomDay(LocalDateTime start, LocalDateTime end) {
        if(start.isAfter(end)) return false;

        LocalDateTime dayStart = getCustomDayStart(end);
        LocalDateTime dayEnd = getCustomDayEnd(end);

        return !start.isBefore(dayStart) && !end.isAfter(dayEnd);
    }
}
