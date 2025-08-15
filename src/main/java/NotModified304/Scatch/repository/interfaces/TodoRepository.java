package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Todo;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TodoRepository {
    Todo save(Todo todo);
    Optional<Todo> findById(Long id);
    List<Todo> findByDate(String userId, LocalDate date);
    List<Todo> findAll();
    void delete(Todo todo);
}
