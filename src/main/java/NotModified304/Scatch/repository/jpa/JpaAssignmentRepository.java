package NotModified304.Scatch.repository.jpa;

import NotModified304.Scatch.domain.Assignment;
import NotModified304.Scatch.repository.interfaces.AssignmentRepository;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JpaAssignmentRepository implements AssignmentRepository {

    private final EntityManager em;

    public JpaAssignmentRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public Assignment save(Assignment assignment) {
        em.persist(assignment);
        return assignment;
    }

    @Override
    public List<Assignment> findAll(Long courseId) {
        return em.createQuery("select a from Assignment a where a.course.id = :courseId", Assignment.class)
                .setParameter("courseId", courseId)
                .getResultList();
    }
}
