package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // username, name, is_active = true
    Optional<Category> findByUsernameAndNameAndIsActiveTrue(String username, String name);
    List<Category> findByUsernameAndIsActive(String username, Boolean isActive);
}

