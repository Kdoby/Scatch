package NotModified304.Scatch.service.timeTable;

import NotModified304.Scatch.domain.timeTable.Course;
import NotModified304.Scatch.domain.timeTable.TimeTable;
import NotModified304.Scatch.domain.timeTable.TimeTableDetail;
import NotModified304.Scatch.dto.timeTable.response.CourseInMainResponse;
import NotModified304.Scatch.dto.timeTable.request.TimeTableDetailRequest;
import NotModified304.Scatch.dto.timeTable.request.TimeTableDetailUpdate;
import NotModified304.Scatch.dto.timeTable.response.TimeTableWithCourseResponse;
import NotModified304.Scatch.repository.interfaces.timeTable.TimeTableDetailRepository;
import NotModified304.Scatch.repository.interfaces.timeTable.TimeTableRepository;
import NotModified304.Scatch.security.SecurityUtil;
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
    private final TimeTableDetailRepository ttdRepository;
    private final TimeTableRepository ttRepository;
    private final CourseService courseService;

    public TimeTableDetail findTimeTableDetail(Long id) {

        return ttdRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 세부 시간표입니다."));
    }

    // fix: 이미 등록되어 있는 경우에는 자신의 시간은 제외하고 생각해야함
    public void TimeCheck(Long selfId, Long timeTableId, int weekday, LocalTime newStart, LocalTime newEnd) {

        if(newEnd.isBefore(newStart) || newEnd.equals(newStart)) {
            throw new IllegalArgumentException("올바르지 않은 시간입니다.");
        }

        List<TimeTableDetail> details = ttdRepository.findByTimeTable_IdAndWeekday(timeTableId, weekday);

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

    // 생성한 course_id를 리턴 : 추가 저장을 위해
    public Long saveTimeTableDetail(String username, TimeTableDetailRequest req) {

        // 시간표에 대한 유효성 검사
        TimeTable timeTable = ttRepository.findById(req.getTimeTableId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시간표입니다."));
        SecurityUtil.validateOwner(timeTable.getUsername(), username);

        // 강좌에 대한 유효성 검사
        Course course = courseService.findCourse(req.getCourseId());
        SecurityUtil.validateOwner(course.getUsername(), username);

        // 새로 추가하는 경우, selfId 를 -1로함.
        TimeCheck(null, req.getTimeTableId(), req.getWeekday(), req.getStartTime(), req.getEndTime());

        // 겹치지 않는 경우 Entity 생성 후, 저장
        TimeTableDetail ttd = TimeTableDetail.builder()
                .timeTable(timeTable)
                .course(course)
                .weekday(req.getWeekday())
                .location(req.getLocation())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .build();

        ttdRepository.save(ttd);
        return ttd.getCourse().getId();
    }

    // 세부 시간표 정보 수정
    public void updateTimeTableDetail(String username, TimeTableDetailUpdate req) {

        TimeTableDetail ttd = findTimeTableDetail(req.getTimeTableDetailId());

        TimeTable tt = ttd.getTimeTable();
        Course course = ttd.getCourse();

        // 수정 권한 체크
        SecurityUtil.validateOwner(tt.getUsername(), username);
        SecurityUtil.validateOwner(course.getUsername(), username);

        // 세부 시간표 정보 업데이트
        Integer newWeekday = req.getWeekday();
        String newLocation = req.getLocation();
        LocalTime newStart = req.getStartTime() == null ? ttd.getStartTime() : req.getStartTime();
        LocalTime newEnd = req.getEndTime() == null ? ttd.getEndTime() : req.getEndTime();

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
    public Long deleteTimeTableDetail(String username, Long id) {

        TimeTableDetail ttd = findTimeTableDetail(id);
        Long courseId = ttd.getCourse().getId();

        // 삭제 권한 체크
        SecurityUtil.validateOwner(ttd.getCourse().getUsername(), username);

        ttdRepository.delete(ttd);

        // 해당 courseId를 참조하는 세부 시간표가 더이상 없으면, 강좌 및 과제도 함께 삭제
        if(ttdRepository.countByCourse_Id(courseId) == 0) {
            courseService.deleteCourse(courseId);
        }

        return courseId;
    }

    // 특정 시간표(학기)에 해당하는 시간표 리스트 출력
    public List<TimeTableWithCourseResponse> findAllTimeTableDetails(String username, Long timeTableId) {

        // 시간표에 대한 유효성 검사
        TimeTable timeTable = ttRepository.findById(timeTableId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시간표입니다."));
        // 시간표에 대한 접근 권한 체크
        SecurityUtil.validateOwner(timeTable.getUsername(), username);

        // 현재 해당 시간표, 요일의 세부 시간표들을 list 로 가져옴
        List<TimeTableDetail> details = ttdRepository.findByTimeTable_Id(timeTableId);

        // key : course, value : details
        Map<Course, List<TimeTableDetail>> grouped = details.stream()
                .collect(Collectors.groupingBy(TimeTableDetail::getCourse));

        return grouped.entrySet().stream()
                .map(entry -> new TimeTableWithCourseResponse(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // main 시간표에 속하는 강좌 조회
    public List<CourseInMainResponse> findCoursesByTimeTableId(String username) {

        // main 시간표 조회
        TimeTable tt = ttRepository.findByUsernameAndIsMain(username, true)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시간표입니다."));

        return  ttdRepository.findDistinctCoursesByTimeTableId(tt.getId())
                .stream().map(CourseInMainResponse::from)
                .toList();
    }
}
