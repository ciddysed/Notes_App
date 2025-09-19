package Yuutsu_1.Listify.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "notifications")
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private TaskEntity task;

    @Column(nullable = false)
    private LocalDate notificationDate;

    @Column(nullable = false)
    private boolean isRead = false; // New field to track the read status

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TaskEntity getTask() { return task; }
    public void setTask(TaskEntity task) { this.task = task; }

    public LocalDate getNotificationDate() { return notificationDate; }
    public void setNotificationDate(LocalDate notificationDate) { this.notificationDate = notificationDate; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
}
