package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
