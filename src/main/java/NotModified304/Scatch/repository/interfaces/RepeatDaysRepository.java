package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.RepeatDays;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RepeatDaysRepository extends JpaRepository<RepeatDays, Long> {
    // 해당 루틴의 반복 요일 조회
    @Query("SELECT rd.weekOfDay FROM RepeatDays rd " +
            "WHERE rd.routineId = :routineId")
    List<Integer> findRepeatDays(@Param("routineId") Long routineId);

    void deleteByRoutineId(Long routineId);
}
