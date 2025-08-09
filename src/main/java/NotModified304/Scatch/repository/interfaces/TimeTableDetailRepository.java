package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.TimeTableDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// 연관 관계 경로 탐색 = 필드명_연결필드 (ex) timeTable.id -> findByTimeTable_Id ( ... ))
public interface TimeTableDetailRepository extends JpaRepository<TimeTableDetail, Long> {
    // 특정 시간표에 등록된 모든 세부 시간표 조회
    List<TimeTableDetail> findByTimeTable_Id(Long TimeTableId);
    // timeTableId, weekday 이 같은 세부 시간표 목록 조회
    List<TimeTableDetail> findByTimeTable_IdAndWeekday(Long timeTableId, int weekday);
    Long countByCourse_Id(Long courseId);
}
