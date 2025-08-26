package NotModified304.Scatch.repository.interfaces.routine;

import NotModified304.Scatch.domain.routine.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoutineRepository extends JpaRepository<Routine, Long> {

    // 루틴 중에서 targetDate 범위 내에 속하고, 활성화 된 것
    @Query("SELECT r FROM Routine r " +
            "WHERE r.username = :username " +
            "AND r.startDate <= :targetDate " +
            "AND r.endDate >= :targetDate")
    List<Routine> findRoutinesOnDate(@Param("username") String username,
                                     @Param("targetDate")LocalDate targetDate);

    @Query("SELECT r FROM Routine r " +
            "WHERE r.username = :username " +
            "AND r.startDate <= :lastDay " +
            "AND r.endDate >= :firstDay")
    List<Routine> findRoutinesInMonth(@Param("username") String username,
                                      @Param("firstDay") LocalDate firstDay,
                                      @Param("lastDay") LocalDate lastDay);

    // 반복 종료일자를 넘기면 루틴 자동 종료
    @Modifying
    @Query("UPDATE Routine r SET r.isClosed = true WHERE r.endDate < :today AND r.isClosed = false")
    int closedExpiredRoutines(@Param("today") LocalDate today);
}
