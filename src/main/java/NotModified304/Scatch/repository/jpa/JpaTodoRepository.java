/*
package NotModified304.Scatch.repository.jpa;

import NotModified304.Scatch.domain.Todo;
import NotModified304.Scatch.repository.interfaces.TodoRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class JpaTodoRepository implements TodoRepository {
    EntityManager em;

    public JpaTodoRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public Todo save(Todo todo) {
        em.persist(todo);
        return todo;
    }

    @Override
    public void delete(Todo todo){
        em.remove(todo);
    }

    @Override
    public Optional<Todo> findById(Long id) {
        Todo todo = em.find(Todo.class, id);
        return Optional.ofNullable(todo);
    }

    // 특정 날짜에 대한 todoList
    @Override
    public List<Todo> findByDate(String userId, LocalDate date) {
        // 활성화 카테고리에 대한 todo - 비활성화 카테고리에 대한 todo 순으로 select
        return em.createQuery("select t from Todo t join t.category c where t.todoDate = :date and t.userId = :userId " +
                        "order by c.isActive desc", Todo.class)
                .setParameter("date", date)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public List<Todo> findAll() {
        return em.createQuery("select t from Todo t", Todo.class)
                .getResultList();
    }
}
*/
