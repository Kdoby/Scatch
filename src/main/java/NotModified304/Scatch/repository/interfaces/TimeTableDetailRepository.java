package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.TimeTableDetail;

import java.util.List;
import java.util.Optional;

public interface TimeTableDetailRepository {
    TimeTableDetail save(TimeTableDetail timeTableDetail);
    // 특정 시간표에 등록된 모든 세부 시간표 조회
    List<TimeTableDetail> findAll(Long timeTableId);
    Optional<TimeTableDetail> findById(Long id);
    // timeTableId, weekday 이 같은 세부 시간표 목록 조회
    List<TimeTableDetail> findByWeekDay(Long timeTableId, int weekday);
    void delete(TimeTableDetail timeTableDetail);
    Long findByCourseId(Long courseId);
}
