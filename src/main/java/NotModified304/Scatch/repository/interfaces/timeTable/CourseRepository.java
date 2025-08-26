package NotModified304.Scatch.repository.interfaces.timeTable;

import NotModified304.Scatch.domain.timeTable.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
