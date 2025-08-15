package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    @Query("SELECT l FROM Lesson l " +
            "WHERE l.username = :username " +
            "AND l.lessonDate = :date")
    Lesson findByDate(@Param("username") String username,
                      @Param("date") LocalDate date);
}
