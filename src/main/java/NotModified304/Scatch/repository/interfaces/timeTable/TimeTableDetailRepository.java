package NotModified304.Scatch.repository.interfaces.timeTable;

import NotModified304.Scatch.domain.timeTable.Course;
import NotModified304.Scatch.domain.todo.TimeTableDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// 연관 관계 경로 탐색 = 필드명_연결필드 (ex) timeTable.id -> findByTimeTable_Id ( ... ))
public interface TimeTableDetailRepository extends JpaRepository<TimeTableDetail, Long> {
    // 특정 시간표에 등록된 모든 세부 시간표 조회
    List<TimeTableDetail> findByTimeTable_Id(Long TimeTableId);
    // timeTableId, weekday 이 같은 세부 시간표 목록 조회
    List<TimeTableDetail> findByTimeTable_IdAndWeekday(Long timeTableId, int weekday);
    Long countByCourse_Id(Long courseId);

    // main 시간표의 강좌 목록 조회
    @Query("SELECT DISTINCT c FROM TimeTableDetail ttd " +
            "JOIN ttd.course c " +
            "WHERE ttd.timeTable.id = :timeTableId " +
            "ORDER BY c.title ASC")
    List<Course> findDistinctCoursesByTimeTableId(@Param("timeTableId") Long timeTableId);
}
