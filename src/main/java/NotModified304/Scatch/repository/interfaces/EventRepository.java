package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // 이게 계속 반복 호출
    @Query("select e from Event e " +
            "where e.userId = :userId " +
            "and e.repeat <> 'none' " +
            "order by case when e.startDate <> e.endDate then 0 else 1 end, e.startDate")
    List<Event> findRepeatEvents(@Param("userId") String userId);

    // 단일 일정 중에서 특정 날짜를 포함하는 일정
    // targetDate가 시작일~종료일 범위 내에 포함되어 있으면 그 일정은 targetDate에 해당
    @Query("select e from Event e " +
            "where e.userId = :userId " +
            "and e.repeat = 'none' " +
            "and e.startDate <= :targetDate " +
            "and e.endDate >= :targetDate " +
            "order by case when e.startDate <> e.endDate then 0 else 1 end, e.startDate")
    List<Event> findSingleEventsByDate(@Param("userId") String userId,
                                       @Param("targetDate") LocalDate targetDate);

    // 단일 일정(반복 x) 중에서 특정 년, 월에 포함되는 일정들
    @Query("select e from Event e " +
            "where e.userId = :userId " +
            "and e.repeat = 'none' " +
            "and function('year', e.startDate) = :year " +
            "and function('month', e.startDate) = :month " +
            "order by case when e.startDate <> e.endDate then 0 else 1 end, e.startDate")
    List<Event> findSingleEventsByYearAndMonth(@Param("userId") String userId,
                                               @Param("year") Long year,
                                               @Param("month") Long month);
}
