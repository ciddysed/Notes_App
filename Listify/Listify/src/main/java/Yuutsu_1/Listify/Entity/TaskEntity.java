package Yuutsu_1.Listify.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

import org.hibernate.annotations.BatchSize;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tasks")
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String task;

    @Column(nullable = false)
    private String taskStatus;

    @Column
    private LocalDate date; // Field to store the date of the task

    @OneToMany(mappedBy = "task", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JsonIgnore
    @BatchSize(size = 10)
    private List<SubnoteEntity> subnotes;

    

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public String getTaskStatus() {
        return taskStatus;
    }

    public void setTaskStatus(String taskStatus) {
        this.taskStatus = taskStatus;
    }

    public LocalDate getDate() { // Getter for date
        return date;
    }

    public void setDate(LocalDate date) { // Setter for date
        this.date = date;
    }

    public List<SubnoteEntity> getSubnotes() { // Getter for subnotes
        return subnotes;
    }

    public void setSubnotes(List<SubnoteEntity> subnotes) { // Setter for subnotes
        this.subnotes = subnotes;
    }
}
