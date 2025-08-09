package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Assignment;
import NotModified304.Scatch.domain.Course;
import NotModified304.Scatch.dto.assignment.request.AssignmentCreateRequest;
import NotModified304.Scatch.dto.assignment.request.AssignmentUpdateRequest;
import NotModified304.Scatch.dto.assignment.response.AssignmentResponse;
import NotModified304.Scatch.repository.interfaces.AssignmentRepository;
import NotModified304.Scatch.repository.interfaces.CourseRepository;
import NotModified304.Scatch.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    public Assignment findById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 과제입니다."));
    }

    public Long registerAssignment(String username, AssignmentCreateRequest req) {
        Course course = courseRepository.findById(req.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌입니다."));

        SecurityUtil.validateOwner(course.getUsername(), username);

        Assignment assignment = Assignment.builder()
                .username(username)
                .courseId(req.getCourseId())
                .courseTitle(course.getTitle())
                .color(course.getColor())
                .title(req.getTitle())
                .deadline(req.getDeadline())
                .build();

        assignmentRepository.save(assignment);

        return assignment.getId();
    }

    public Long updateAssignment( String username, AssignmentUpdateRequest req) {
        Assignment assignment = findById(req.getId());

        // 접근 권한 검사
        SecurityUtil.validateOwner(assignment.getUsername(), username);
        
        assignment.setTitle(req.getTitle());
        assignment.setDeadline(req.getDeadline());

        assignmentRepository.save(assignment);
        return assignment.getId();
    }

    // 특정 강좌에 대한 과제 목록 조회
    public List<AssignmentResponse> findAssignmentsByCourseId(String username, Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌입니다."));

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
        Assignment assignment = findById(id);

        SecurityUtil.validateOwner(assignment.getUsername(), username);

        assignmentRepository.delete(assignment);
    }
}
