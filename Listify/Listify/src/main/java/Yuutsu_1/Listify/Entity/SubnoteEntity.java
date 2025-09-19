package Yuutsu_1.Listify.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
public class SubnoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subnoteID;  // Change from int to Long
    
    private String subnote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    @JsonIgnore
    private TaskEntity task;


    // Getters and setters

    public Long getSubnoteID() {  // Change return type to Long
        return subnoteID;
    }

    public void setSubnoteID(Long subnoteID) {  // Change parameter type to Long
        this.subnoteID = subnoteID;
    }

    public String getSubnote() {
        return subnote;
    }

    public void setSubnote(String subnote) {
        this.subnote = subnote;
    }

    public TaskEntity getTask() {
        return task;
    }

    public void setTask(TaskEntity task) {
        this.task = task;
    }
}
