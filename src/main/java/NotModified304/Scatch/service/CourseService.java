package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Assignment;
import NotModified304.Scatch.domain.Course;
import NotModified304.Scatch.dto.assignment.request.AssignmentCreateRequest;
import NotModified304.Scatch.dto.assignment.request.AssignmentUpdateRequest;
import NotModified304.Scatch.dto.assignment.response.AssignmentResponse;
import NotModified304.Scatch.dto.timeTable.course.CourseRequestDto;
import NotModified304.Scatch.dto.timeTable.course.CourseUpdateDto;
import NotModified304.Scatch.repository.interfaces.AssignmentRepository;
import NotModified304.Scatch.repository.interfaces.CourseRepository;
import NotModified304.Scatch.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;

    public Course findCourse(Long id) {

        return courseRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 강좌입니다.")
        );
    }

    public Assignment findAssignment(Long id) {

        return assignmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 과제입니다."));
    }

    // 강좌 등록
    public Long saveCourse(String username, CourseRequestDto req) {

        Course course = Course.builder()
                .username(username)
                .title(req.getTitle())
                .instructor(req.getInstructor())
                .color(req.getColor())
                .build();

        courseRepository.save(course);
        return course.getId();
    }

    // 강좌 정보 수정
    public void updateCourse(String username, CourseUpdateDto req) {

        Course course = findCourse(req.getCourseId());

        // 수정 권한 체크
        SecurityUtil.validateOwner(course.getUsername(), username);
        
        // 강좌 정보 업데이트
        String newTitle = req.getTitle();
        String newInstructor = req.getInstructor();
        String newColor = req.getColor();
        
        if(newTitle != null) {
            course.setTitle(newTitle);

            // 해당 강좌의 과제에서도 title 업데이트
            assignmentRepository.updateCourseTitle(course.getId(), newTitle);
        }
        if(newInstructor != null) course.setInstructor(newInstructor);
        if(newColor != null) {
            course.setColor(newColor);

            // 해당 강좌의 과제 색 업데이트
            assignmentRepository.updateColor(course.getId(), newColor);
        }
    }

    // 강좌 정보 삭제 + 과제 정보 삭제
    public void deleteCourse(Long id) {

        assignmentRepository.deleteByCourseId(id);
        courseRepository.deleteById(id);
    }

    // 과제 등록
    public Long registerAssignment(String username, AssignmentCreateRequest req) {

        Course course = findCourse(req.getCourseId());
        
        SecurityUtil.validateOwner(course.getUsername(), username);

        Assignment assignment = Assignment.builder()
                .username(username)
                .courseId(req.getCourseId())
                .courseTitle(course.getTitle())
                .color(course.getColor())
                .title(req.getTitle())
                .memo(req.getMemo())
                .deadline(req.getDeadline())
                .build();

        assignmentRepository.save(assignment);

        return assignment.getId();
    }

    public Long updateAssignment( String username, AssignmentUpdateRequest req) {

        Assignment assignment = findAssignment(req.getId());

        // 접근 권한 검사
        SecurityUtil.validateOwner(assignment.getUsername(), username);

        assignment.setTitle(req.getTitle());
        assignment.setMemo(req.getMemo());
        assignment.setDeadline(req.getDeadline());

        assignmentRepository.save(assignment);
        return assignment.getId();
    }

    // 특정 강좌에 대한 과제 목록 조회
    public List<AssignmentResponse> findAssignmentsByCourseId(String username, Long courseId) {

        Course course = findCourse(courseId);

        // 특정 강좌에 대한 접근 권한 검사
        SecurityUtil.validateOwner(course.getUsername(), username);

        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);

        return assignments.stream()
                .map(AssignmentResponse::from)
                .toList();
    }

    // 특정 날짜에 해당하는 과제 조회
    public List<AssignmentResponse> findAssignmentsByDate(String username, LocalDate date) {

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        List<Assignment> assignments = assignmentRepository.findByDate(username, start, end);

        return assignments.stream()
                .map(AssignmentResponse::from)
                .toList();
    }

    // 특정 달에 속한 과제 조회
    public List<AssignmentResponse> findAssignmentsByYearAndMonth(String username, Long year, Long month) {

        List<Assignment> assignments = assignmentRepository.findByYearAndMonth(username, year, month);

        return assignments.stream()
                .map(AssignmentResponse::from)
                .toList();
    }

    // 과제 단독 삭제
    public void removeAssignment(String username, Long id) {

        Assignment assignment = findAssignment(id);

        SecurityUtil.validateOwner(assignment.getUsername(), username);

        assignmentRepository.delete(assignment);
    }
}
