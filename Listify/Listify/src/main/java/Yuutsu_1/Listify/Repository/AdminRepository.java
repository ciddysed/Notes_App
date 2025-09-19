package Yuutsu_1.Listify.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import Yuutsu_1.Listify.Entity.AdminEntity;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
    Optional<AdminEntity> findByEmailAndPassword(String email, String password);
}
