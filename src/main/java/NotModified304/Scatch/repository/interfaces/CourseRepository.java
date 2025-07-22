package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Course;

import java.util.List;
import java.util.Optional;

public interface CourseRepository {
    Course save(Course course);
    List<Course> findAll(String userId);
    Optional<Course> findById(Long id);
    void delete(Course course);
}
