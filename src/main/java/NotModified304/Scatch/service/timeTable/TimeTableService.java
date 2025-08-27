package NotModified304.Scatch.service.timeTable;

import NotModified304.Scatch.domain.timeTable.TimeTable;
import NotModified304.Scatch.domain.timeTable.TimeTableDetail;
import NotModified304.Scatch.dto.timeTable.request.TimeTableRequest;
import NotModified304.Scatch.dto.timeTable.response.TimeTableResponse;
import NotModified304.Scatch.dto.timeTable.request.TimeTableUpdate;
import NotModified304.Scatch.repository.interfaces.timeTable.TimeTableDetailRepository;
import NotModified304.Scatch.repository.interfaces.timeTable.TimeTableRepository;
import NotModified304.Scatch.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TimeTableService {
    private final TimeTableRepository ttRepository;
    private final TimeTableDetailRepository ttdRepository;
    private final CourseService courseService;
    // private final CourseRepository courseRepository;
    // private final AssignmentRepository assignmentRepository;

    // 특정 id에 해당하는 시간표 리턴
    public TimeTable findTimeTable(Long id) {

        return ttRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 시간표입니다.")
        );
    }

    // 새 시간표 등록
    public void saveTimeTable(String username, TimeTableRequest req) {
        
        TimeTable timeTable = TimeTable.builder()
                .username(username)
                .name(req.getName())
                .build();

        // isMain이 존재하는지 먼저 확인하고, 없으면 지금 추가하는 걸 isMain으로 설정
        boolean exists = ttRepository.findByUsernameAndIsMain(username, true).isPresent();
        timeTable.setIsMain(!exists);

        ttRepository.save(timeTable);
    }

    // 시간표 정보 수정
    public void updateTimeTable(String username, Long id, TimeTableUpdate req) {
        
        TimeTable timeTable = findTimeTable(id);

        // 수정 권한 체크
        SecurityUtil.validateOwner(timeTable.getUsername(), username);

        if(req.getName() != null) timeTable.setName(req.getName());

        // is_main 시간표를 수정하는 경우: 이미 존재하는 main 이 있으면 걔를 취소하고 업데이트
        if(req.getIsMain() != null && Boolean.TRUE.equals(req.getIsMain())) {
            Optional<TimeTable> currentMain = ttRepository.findByUsernameAndIsMain(username, true);
            currentMain.ifPresent(main -> main.setIsMain(false));
            timeTable.setIsMain(true);
        }
    }

    // 시간표 삭제
    // fix: 해당 시간표 밑에 있던 모든 세부시간표 및 강좌(cascade x)를 삭제 해야함
    // fix: 삭제 후에 main 인 애가 없으면 얘로 업데이트
    public void deleteTimeTable(String username, Long id) {

        TimeTable timeTable = findTimeTable(id);

        // 삭제 권한 체크
        SecurityUtil.validateOwner(timeTable.getUsername(), username);

        boolean wasMain = timeTable.getIsMain();

        // 해당 시간표에 속한 세부 시간표 목록 가져오기
        List<TimeTableDetail> details = ttdRepository.findByTimeTable_Id(id);
        
        // 세부 시간표가 속한 courses 가져오기
        // set: distinct 하게 가져옴
        Set<Long> courseIds = details.stream()
                .map(detail -> detail.getCourse().getId())
                .collect(Collectors.toSet());

        ttRepository.delete(timeTable);

        // 삭제된 시간표 main 시간표였던 경우,
        if(wasMain) {
            // 가장 최근에 생성한 시간표가 main이 됨
            List<TimeTable> remaining = ttRepository.findByUsernameOrderByCreatedAtDesc(username);
            if(remaining != null && !remaining.isEmpty()){
                TimeTable newest = remaining.get(0);
                newest.setIsMain(true);
            }
        }

        // 시간표 삭제 시, 그 안에 속한 강의 및 과제 삭제 (세부 시간표 목록은 CASCADE 삭제됨)
        for(Long courseId : courseIds) {
            // Course course = courseService.findCourse(courseId);
            courseService.deleteCourse(courseId);
            // assignmentRepository.deleteByCourseId(courseId);
        }
    }

    // 특정 유저가 등록한 전체 시간표(학기별) 목록 조회
    public List<TimeTableResponse> findTimeTableList(String username) {

        // TimeTable domain -> TimeTableResponseDto
        return ttRepository.findByUsername(username)
                .stream()
                .map(TimeTableResponse::new)
                .collect(Collectors.toList());
    }
}
