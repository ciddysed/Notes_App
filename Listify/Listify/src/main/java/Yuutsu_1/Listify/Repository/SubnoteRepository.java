package Yuutsu_1.Listify.Repository;

import Yuutsu_1.Listify.Entity.SubnoteEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubnoteRepository extends JpaRepository<SubnoteEntity, Long> {
    List<SubnoteEntity> findByTaskId(Long taskId); // This should work fine with Long
}
