package NotModified304.Scatch.repository.interfaces.todo;

import NotModified304.Scatch.domain.todo.StudyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StudyLogRepository extends JpaRepository<StudyLog, Long> {
    @Query("SELECT s FROM StudyLog s " +
            "WHERE s.username = :username " +
            "AND s.logDate = :date " +
            "ORDER BY s.startTime, isManual")
    List<StudyLog> findByDate(@Param("username") String username,
                              @Param("date")LocalDate date);

    // 특정 날짜에 겹치는 기록이 있는지 확인
    @Query("SELECT COUNT(s) > 0 FROM StudyLog s " +
            "WHERE s.username = :username " +
            "AND s.logDate = :date " +
            "AND (s.startTime < :end AND s.endTime > :start)")
    boolean existOverlap(@Param("username") String username,
                         @Param("date") LocalDate date,
                         @Param("start")LocalDateTime start,
                         @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(s) > 0 FROM StudyLog s " +
            "WHERE s.username = :username " +
            "AND s.logDate = :date " +
            "AND s.id <> :excludeId " +
            "AND (s.startTime < :end AND s.endTime > :start)")
    boolean existOverlapExcludeMe(@Param("excludeId") Long excludeId,
                         @Param("username") String username,
                         @Param("date") LocalDate date,
                         @Param("start")LocalDateTime start,
                         @Param("end") LocalDateTime end);
}
