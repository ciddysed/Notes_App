package Yuutsu_1.Listify.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "calendar")
public class CalendarEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne // Establish a many-to-one relationship with TaskEntity
    @JoinColumn(name = "task_id", nullable = false)
    private TaskEntity task; // Reference to the TaskEntity

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TaskEntity getTask() {
        return task;
    }

    public void setTask(TaskEntity task) {
        this.task = task;
    }
}
