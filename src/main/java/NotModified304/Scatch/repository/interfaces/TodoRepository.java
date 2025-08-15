package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT t FROM Todo t " +
            "JOIN t.category c " +
            "WHERE t.username = :username " +
            "AND t.todoDate = :date " +
            "ORDER BY c.isActive DESC")
    List<Todo> findByDateOrderByCategoryActiveDesc(@Param("username") String username,
                                                   @Param("date") LocalDate date);
}
