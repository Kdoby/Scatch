//package NotModified304.Scatch.service;
//
//import NotModified304.Scatch.domain.Assignment;
//import NotModified304.Scatch.domain.Course;
//import NotModified304.Scatch.dto.assignment.request.AssignmentCreateRequest;
//import NotModified304.Scatch.dto.assignment.request.AssignmentUpdateRequest;
//import NotModified304.Scatch.dto.assignment.response.AssignmentResponse;
//import NotModified304.Scatch.repository.interfaces.AssignmentRepository;
//import NotModified304.Scatch.repository.interfaces.CourseRepository;
//import NotModified304.Scatch.security.SecurityUtil;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class AssignmentService {
//
//    private final AssignmentRepository assignmentRepository;
//    private final CourseRepository courseRepository;
//
//    public Assignment findById(Long id) {
//        return assignmentRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 과제입니다."));
//    }
//
//    public Long registerAssignment(AssignmentCreateRequest req, String username) {
//        Course course = courseRepository.findById(req.getCourseId())
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌입니다."));
//
//        Assignment assignment = Assignment.builder()
//                .courseId(req.getCourseId())
//                .title(req.getTitle())
//                .color(course.getColor())
//                .deadline(req.getDeadline())
//                .username(username)
//                .build();
//
//        assignmentRepository.save(assignment);
//
//        return assignment.getId();
//    }
//
//    public Long updateAssignment( String username, AssignmentUpdateRequest req) {
//        Assignment assignment = findById(req.getId());
//
//        // 접근 권한 검사
//        SecurityUtil.validateOwner(assignment.getUsername(), username);
//
//        assignment.setTitle(req.getTitle());
//        assignment.setDeadline(req.getDeadline());
//
//        assignmentRepository.save(assignment);
//        return assignment.getId();
//    }
//
//    public void removeAssignment(String username, Long id) {
//        Assignment assignment = findById(id);
//
//        SecurityUtil.validateOwner(assignment.getUsername(), username);
//
//        assignmentRepository.delete(assignment);
//    }
//
//    // 특정 강좌에 대한 과제 목록 조회
//    public List<AssignmentResponse> findAssignmentsByCourseId(String username, Long courseId) {
//
//        Course course = courseRepository.findById(courseId)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌입니다."));
//
//        // 특정 강좌에 대한 접근 권한 검사
//        SecurityUtil.validateOwner(course.getUserId(), username);
//
//        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
//
//        return assignments.stream()
//                .map(a -> AssignmentResponse.from(a, course.getTitle()))
//                .toList();
//    }
//
//    // 특정 날짜에 해당하는 과제 조회
//    public List<AssignmentResponse> findByDate(String username, LocalDate date) {
//
//    }
//
//    // 특정 달에 속한 과제 조회
//    public List<AssignmentResponse> findAssignmentsByYearAndMonth(String username, Long year, Long month) {
//
//    }
//
//    // color 일괄 업데이트
//
//
//    // 강좌 삭제 시, 과제도 함께 삭제
//    public void removeByCourseId(Long courseId) {
//        assignmentRepository.deleteByCourseId(courseId);
//    }
//}
