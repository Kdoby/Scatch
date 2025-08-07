package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseId(Long courseId);
    void deleteByCourseId(Long courseId);

    @Query("SELECT a from Assignment a " +
            "WHERE a.username =: username " +
            "AND FUNCTION('DATE', a.deadline) =: targetDate")
    List<Assignment> findByDate(@Param("username") String username,
                                @Param("targetDate")LocalDate targetDate);


}
