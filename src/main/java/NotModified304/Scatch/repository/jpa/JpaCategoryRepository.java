/*
package NotModified304.Scatch.repository.jpa;

import NotModified304.Scatch.domain.Category;
import NotModified304.Scatch.repository.interfaces.CategoryRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class JpaCategoryRepository implements CategoryRepository {

    // 값이 하나라도 있으면 그 중 하나를 반환
    @Override
    public Optional<Category> findByCategoryName(String userId, String categoryName) {
        return em.createQuery("select c from Category c where c.userId = :userId and" +
                " c.name = :categoryName and c.isActive = true", Category.class)
                .setParameter("userId", userId)
                .setParameter("categoryName", categoryName)
                .getResultList()
                .stream()
                .findAny();
    }

    @Override
    public List<Category> findByUserIdAndIsActive(String userId, Boolean isActive) {
        return em.createQuery("select c from Category c where c.userId = :userId and c.isActive = :isActive", Category.class)
                .setParameter("userId", userId)
                .setParameter("isActive", isActive)
                .getResultList();
    }
}
*/
