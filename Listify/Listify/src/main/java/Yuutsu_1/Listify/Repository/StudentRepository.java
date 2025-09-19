package Yuutsu_1.Listify.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Yuutsu_1.Listify.Entity.StudentEntity;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    Optional<StudentEntity> findByEmailAndPassword(String email, String password);
    boolean existsByEmail(String email);
}
