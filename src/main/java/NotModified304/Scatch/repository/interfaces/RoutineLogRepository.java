package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.RoutineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RoutineLogRepository extends JpaRepository<RoutineLog, Long> {
    // 특정 날짜의 루틴 기록 조회
    @Query("SELECT rl FROM RoutineLog rl " +
            "WHERE rl.routineId = :routineId " +
            "AND rl.date = :logDate")
    Optional<RoutineLog> findLog(@Param("routineId") Long routineId, @Param("logDate")LocalDate logDate);

    // 특정 날짜 범위의 루틴 기록 조회
    @Query("SELECT rl FROM RoutineLog rl " +
            "WHERE rl.routineId IN :routineIds " +
            "AND rl.date BETWEEN :startDate AND :endDate")
    List<RoutineLog> findLogsInRange(@Param("routineIds") List<Long> routineIds,
                                     @Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate);

    // 루틴 id로 log 삭제
    void deleteByRoutineId(Long routineId);

    // 기존 시작일자 이전 로그 삭제
    void deleteByRoutineIdAndDateBefore(Long routineId, LocalDate date);

    // 기존 종료일자 이후 로그 삭제
    void deleteByRoutineIdAndDateAfter(Long routineId, LocalDate date);
}
