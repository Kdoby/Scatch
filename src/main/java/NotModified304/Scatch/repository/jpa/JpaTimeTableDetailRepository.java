package NotModified304.Scatch.repository.jpa;

import NotModified304.Scatch.domain.TimeTableDetail;
import NotModified304.Scatch.repository.interfaces.TimeTableDetailRepository;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public class JpaTimeTableDetailRepository implements TimeTableDetailRepository {
    private final EntityManager em;

    public JpaTimeTableDetailRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public TimeTableDetail save(TimeTableDetail timeTableDetail) {
        em.persist(timeTableDetail);
        return timeTableDetail;
    }

    @Override
    public List<TimeTableDetail> findAll(Long timeTableId) {
        return em.createQuery("select td from TimeTableDetail td " +
                                "where td.timeTable.id = :timeTableId", TimeTableDetail.class)
                                .setParameter("timeTableId", timeTableId)
                                .getResultList();
    }

    @Override
    public Optional<TimeTableDetail> findById(Long id) {
        TimeTableDetail timeTableDetail = em.find(TimeTableDetail.class, id);
        return Optional.ofNullable(timeTableDetail);
    }

    @Override
    public List<TimeTableDetail> findByWeekDay(Long timeTableId, int weekday) {
        return em.createQuery("select td from TimeTableDetail td " +
                                "where td.timeTable.id = :timeTableId and td.weekday = :weekday", TimeTableDetail.class)
                .setParameter("timeTableId", timeTableId)
                .setParameter("weekday", weekday)
                .getResultList();
    }

    @Override
    public void delete(TimeTableDetail timeTableDetail) {
        em.remove(timeTableDetail);
    }

    @Override
    public Long countByCourseId(Long courseId) {
        return em.createQuery("select count(td) from TimeTableDetail td where td.course.id = :courseId", Long.class)
                .setParameter("courseId", courseId)
                .getSingleResult();
    }
}
