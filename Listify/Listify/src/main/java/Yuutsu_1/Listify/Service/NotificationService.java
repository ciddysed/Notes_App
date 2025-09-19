package Yuutsu_1.Listify.Service;

import Yuutsu_1.Listify.Entity.NotificationEntity;
import Yuutsu_1.Listify.Entity.TaskEntity;
import Yuutsu_1.Listify.Repository.NotificationRepository;
import Yuutsu_1.Listify.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // Scheduled task to check for tasks due tomorrow
    @Scheduled(cron = "0 0 0 * * ?") // Every day at midnight
    public void generateNotifications() {
        LocalDate notificationDate = LocalDate.now().plusDays(1); // Set to 1 day before the task's due date

        // Fetch all tasks
        List<TaskEntity> tasks = taskRepository.findAll();
        tasks.stream()
            .filter(task -> notificationDate.equals(task.getDate())) // Only tasks due tomorrow
            .forEach(task -> {
                // Check if a notification already exists for this task and notification date
                if (notificationRepository.findByTaskAndNotificationDate(task, notificationDate).isEmpty()) {
                    // Create and save a new notification
                    NotificationEntity notification = new NotificationEntity();
                    notification.setTask(task);
                    notification.setNotificationDate(notificationDate);
                    notificationRepository.save(notification);
                }
            });
    }

    public List<NotificationEntity> getNotifications() {
        return notificationRepository.findAll();
    }

    public List<NotificationEntity> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalse(); // Fetch unread notifications
    }

    public void markAsRead(Long id) {
        NotificationEntity notification = notificationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));
        notification.setRead(true); // Update the read status
        notificationRepository.save(notification); // Persist the changes
    }
    
}
