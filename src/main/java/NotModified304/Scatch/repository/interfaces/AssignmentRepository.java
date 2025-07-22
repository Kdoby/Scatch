package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Assignment;

import java.util.List;

public interface AssignmentRepository {
    Assignment save(Assignment assignment);
    List<Assignment> findAll(Long courseId);
}
