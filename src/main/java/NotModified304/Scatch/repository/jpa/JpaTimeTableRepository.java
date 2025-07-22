package NotModified304.Scatch.repository.jpa;

import NotModified304.Scatch.domain.TimeTable;
import NotModified304.Scatch.repository.interfaces.TimeTableRepository;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class JpaTimeTableRepository implements TimeTableRepository {
    private final EntityManager em;

    public JpaTimeTableRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public TimeTable save(TimeTable timeTable) {
        em.persist(timeTable);
        return timeTable;
    }

    @Override
    public List<TimeTable> findAll(String userId) {
        return em.createQuery("select t from TimeTable t where t.userId = :userId", TimeTable.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public Optional<TimeTable> findById(Long id) {
        TimeTable timeTable = em.find(TimeTable.class, id);
        return Optional.ofNullable(timeTable);
    }

    @Override
    public Optional<TimeTable> findIsMain(Boolean isMain, String userId) {
        return em.createQuery("select t from TimeTable t where t.isMain = :isMain and userId = :userId", TimeTable.class)
                .setParameter("isMain", isMain)
                .setParameter("userId", userId)
                .getResultList()
                .stream().findFirst();
    }

    @Override
    public void delete(TimeTable timeTable) {
        em.remove(timeTable);
    }

    @Override
    public List<TimeTable> findAllOrderByCreatedAt(String userId) {
        return em.createQuery("select t from TimeTable t where t.userId = :userId order by t.createdAt desc", TimeTable.class)
                .setParameter("userId", userId)
                .getResultList();
    }
}

