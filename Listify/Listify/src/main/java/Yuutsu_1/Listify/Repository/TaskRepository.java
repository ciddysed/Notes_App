package Yuutsu_1.Listify.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import Yuutsu_1.Listify.Entity.TaskEntity;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    TaskEntity findByTask(String task);
    @Query("SELECT t FROM TaskEntity t LEFT JOIN FETCH t.subnotes WHERE t.id = :id")
    TaskEntity findTaskWithSubnotes(@Param("id") Long id);
    

}
