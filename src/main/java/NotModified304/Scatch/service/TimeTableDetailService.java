package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Course;
import NotModified304.Scatch.domain.TimeTable;
import NotModified304.Scatch.domain.TimeTableDetail;
import NotModified304.Scatch.dto.course.CourseUpdateDto;
import NotModified304.Scatch.dto.timeTable.TimeTableResponseDto;
import NotModified304.Scatch.dto.timeTableDetail.TimeTableDetailRequestDto;
import NotModified304.Scatch.dto.timeTableDetail.TimeTableDetailResponseDto;
import NotModified304.Scatch.dto.timeTableDetail.TimeTableDetailUpdateDto;
import NotModified304.Scatch.dto.timeTableWithCourse.TimeTableWithCourseResponseDto;
import NotModified304.Scatch.repository.interfaces.CourseRepository;
import NotModified304.Scatch.repository.interfaces.TimeTableDetailRepository;
import NotModified304.Scatch.repository.interfaces.TimeTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor

public class TimeTableDetailService {
    private final TimeTableDetailRepository timeTableDetailRepository;
    private final TimeTableRepository timeTableRepository;
    private final CourseRepository courseRepository;

    public TimeTableDetail findTimeTableDetail(Long id) {
        return timeTableDetailRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 세부 시간표입니다."));
    }

    // fix: 이미 등록되어 있는 경우에는 자신의 시간은 제외하고 생각해야함
    public void TimeCheck(Long selfId, Long timeTableId, int weekday, LocalTime newStart, LocalTime newEnd) {
        if(newEnd.isBefore(newStart) || newEnd.equals(newStart)) {
            throw new IllegalArgumentException("올바르지 않은 시간입니다.");
        }

        List<TimeTableDetail> details = timeTableDetailRepository.findByWeekDay(timeTableId, weekday);

        for(TimeTableDetail detail : details) {
            // 자기 자신은 건너뜀
            if (selfId != null && detail.getId().equals(selfId)) continue;
            
            LocalTime start = detail.getStartTime();
            LocalTime end = detail.getEndTime();

            // endTime <= startTime 이면 겹치지 않는 상태
            boolean overlaps = !(end.isBefore(newStart) || newEnd.isBefore(start)
                    || start.equals(newEnd) || end.equals(newStart));
            // 겹치는 시간이 존재하면 reject
            if(overlaps) {
                throw new IllegalArgumentException("겹치는 시간표가 이미 존재합니다.");
            }
        }
    }

    // 특정 시간표(학기)에 해당하는 시간표 리스트 출력
    public List<TimeTableWithCourseResponseDto> findAllTimeTableDetails(Long timeTableId) {
        // 현재 해당 시간표, 요일의 세부 시간표들을 list 로 가져옴
        List<TimeTableDetail> details = timeTableDetailRepository.findAll(timeTableId);

        // key : course, value : details
        Map<Course, List<TimeTableDetail>> grouped = details.stream()
                .collect(Collectors.groupingBy(TimeTableDetail::getCourse));

        return grouped.entrySet().stream()
                .map(entry -> new TimeTableWithCourseResponseDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // Entity 형태로 출력
    public List<TimeTableDetail> findAllTImeTableDetails(Long timeTableId) {
        return timeTableDetailRepository.findAll(timeTableId);
    }

    // 생성한 course_id를 리턴 : 추가 저장을 위해
    public Long saveTimeTableDetail(TimeTableDetailRequestDto dto) {
        // 새로 추가하는 경우, selfId 를 -1로함.
        TimeCheck(null, dto.getTimeTableId(), dto.getWeekday(), dto.getStartTime(), dto.getEndTime());

        TimeTable timeTable = timeTableRepository.findById(dto.getTimeTableId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시간표입니다."));
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌입니다."));

        // 겹치지 않는 경우 Entity 생성 후, 저장
        TimeTableDetail ttd = TimeTableDetail.builder()
                .timeTable(timeTable)
                .course(course)
                .weekday(dto.getWeekday())
                .location(dto.getLocation())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();
        timeTableDetailRepository.save(ttd);
        return ttd.getCourse().getId();
    }

    // 세부 시간표 정보 수정
    public void updateTimeTableDetail(TimeTableDetailUpdateDto dto) {
        TimeTableDetail ttd = findTimeTableDetail(dto.getTimeTableDetailId());
        
        // 세부 시간표 정보 업데이트
        Integer newWeekday = dto.getWeekday();
        String newLocation = dto.getLocation();
        LocalTime newStart = dto.getStartTime() == null ? ttd.getStartTime() : dto.getStartTime();
        LocalTime newEnd = dto.getEndTime() == null ? ttd.getEndTime() : dto.getEndTime();

        if(newWeekday != null) {
            // 시간 겹치는 거 없는지 먼저 체크
            TimeCheck(ttd.getId(), ttd.getTimeTable().getId(), newWeekday, newStart, newEnd);
            
            ttd.setWeekday(newWeekday);
            ttd.setStartTime(newStart);
            ttd.setEndTime(newEnd);
        }
        if(newLocation != null) ttd.setLocation(newLocation);
    }

    // 세부 시간표 삭제
    public Long deleteTimeTableDetail(Long id) {
        TimeTableDetail ttd = findTimeTableDetail(id);
        Long courseId = ttd.getCourse().getId();

        timeTableDetailRepository.delete(ttd);
        return courseId;
    }

    public Long findByCourseId(Long id) {
        return timeTableDetailRepository.findByCourseId(id);
    }
}
