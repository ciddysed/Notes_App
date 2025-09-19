package Yuutsu_1.Listify.Service;

import Yuutsu_1.Listify.Entity.TaskEntity;
import Yuutsu_1.Listify.Repository.TaskRepository;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;


    // Create a new task
    public TaskEntity postTask(TaskEntity task) {
        return taskRepository.save(task);
    }

    // Read all tasks
    public List<TaskEntity> getAllTasks() {
        return taskRepository.findAll();
    }

    // Update task details
    public TaskEntity putTaskDetails(Long id, TaskEntity newTaskDetails) {
        Optional<TaskEntity> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            TaskEntity existingTask = optionalTask.get();
            existingTask.setTask(newTaskDetails.getTask());
            existingTask.setTaskStatus(newTaskDetails.getTaskStatus());
            return taskRepository.save(existingTask);
        }
        throw new IllegalArgumentException("Task not found.");
    }

    // Delete a task
    public void deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Task not found.");
        }
    }

    // New method to record a task with a date
    public void recordTaskWithDate(LocalDate date, Long taskId) {
        Optional<TaskEntity> optionalTask = taskRepository.findById(taskId);
        if (optionalTask.isPresent()) {
            TaskEntity existingTask = optionalTask.get();
            existingTask.setDate(date);
            taskRepository.save(existingTask);
        } else {
            throw new IllegalArgumentException("Task not found.");
        }
    }

    // New method to remove the date from a task
    public void removeDateFromTask(Long taskId) {
        Optional<TaskEntity> optionalTask = taskRepository.findById(taskId);
        if (optionalTask.isPresent()) {
            TaskEntity existingTask = optionalTask.get();
            existingTask.setDate(null); // Remove the date by setting it to null
            taskRepository.save(existingTask);
        } else {
            throw new IllegalArgumentException("Task not found.");
        }
    }
    @Transactional
    public TaskEntity getTaskWithoutSubnotes(Long taskId) {
        return taskRepository.findById(taskId).orElse(null);
    }
    

}
