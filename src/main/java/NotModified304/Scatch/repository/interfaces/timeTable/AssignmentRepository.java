package NotModified304.Scatch.repository.interfaces.timeTable;

import NotModified304.Scatch.domain.timeTable.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseId(Long courseId);
    void deleteByCourseId(Long courseId);

    // 특정 날짜의 과제 조회
    @Query("SELECT a FROM Assignment a " +
            "WHERE a.username = :username " +
            "AND a.deadline >= :startOfDay " +
            "AND a.deadline < :startOfNextDay")
    List<Assignment> findByDate(@Param("username") String username,
                                @Param("startOfDay") LocalDateTime startOfDay,
                                @Param("startOfNextDay") LocalDateTime startOfNextDay);

    // 특정 년/월의 과제 조회
    @Query("SELECT a FROM Assignment a " +
            "WHERE a.username = :username " +
            "AND FUNCTION('year', a.deadline) = :year " +
            "AND FUNCTION('month', a.deadline) = :month " +
            "ORDER BY deadline")
    List<Assignment> findByYearAndMonth(@Param("username") String username,
                                        @Param("year") Long year,
                                        @Param("month") Long month);

    // 과제가 속한 강좌에 따라서 색깔 업데이트
    @Modifying
    @Query("UPDATE Assignment a SET a.color = :color " +
            "WHERE a.courseId = :courseId")
    void updateColor(@Param("courseId") Long courseId,
                     @Param("color") String color);

    // 과제가 속한 강좌에 따라서 제목 업데이트
    @Modifying
    @Query("UPDATE Assignment a SET a.courseTitle = :courseTitle " +
            "WHERE a.courseId = :courseId")
    void updateCourseTitle(@Param("courseId") Long courseId,
                           @Param("courseTitle") String courseTitle);

}
