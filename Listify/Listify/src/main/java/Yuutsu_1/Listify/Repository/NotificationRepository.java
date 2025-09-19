package Yuutsu_1.Listify.Repository;

import Yuutsu_1.Listify.Entity.NotificationEntity;
import Yuutsu_1.Listify.Entity.TaskEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByNotificationDate(LocalDate date);
    Optional<NotificationEntity> findByTaskAndNotificationDate(TaskEntity task, LocalDate notificationDate);

    List<NotificationEntity> findByIsReadFalse(); // Fetch unread notifications
}
