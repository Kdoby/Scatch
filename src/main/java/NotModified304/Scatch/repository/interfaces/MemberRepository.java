package NotModified304.Scatch.repository.interfaces;

import NotModified304.Scatch.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUsername(String username);
    Optional<Member> findByRefreshToken(String refreshToken);

    @Modifying
    @Query("UPDATE Member m " +
            "SET m.paletteNumber = :number " +
            "WHERE m.username = :username")
    void updatePalette(@Param("username") String username,
                       @Param("number") Integer number);
}
