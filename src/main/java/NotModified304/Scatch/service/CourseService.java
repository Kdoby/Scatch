package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Course;
import NotModified304.Scatch.dto.timeTable.course.CourseRequestDto;
import NotModified304.Scatch.dto.timeTable.course.CourseUpdateDto;
import NotModified304.Scatch.repository.interfaces.AssignmentRepository;
import NotModified304.Scatch.repository.interfaces.CourseRepository;
import NotModified304.Scatch.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // 강좌 정보 삭제 (아직 안씀)
    public void deleteCourse(Long id) {
        Course course = findCourse(id);
        courseRepository.delete(course);
    }
}
